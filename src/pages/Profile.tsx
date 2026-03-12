import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Phone, MapPin, Home, Save, CheckCircle2, Clock, Package, Truck, ExternalLink, Search, Crown, Mail, Calendar, ChevronRight, Sparkles, Users, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const Profile = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        birthday: "",
        phone: "",
        city: "",
        address: "",
        points: 0,
        lifetime_points: 0,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [generatedCoupon, setGeneratedCoupon] = useState<string | null>(null);
    const [referrals, setReferrals] = useState<any[]>([]);
    const [isLoadingReferrals, setIsLoadingReferrals] = useState(false);

    const fetchOrders = async (phone: string) => {
        if (!phone) return;
        setIsLoadingOrders(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_phone', phone)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data);
        }
        setIsLoadingOrders(false);
    };

    const fetchReferrals = async (phone: string) => {
        if (!phone) return;
        setIsLoadingReferrals(true);
        // Search for orders where customer_notes contains [Referrer: phone]
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .ilike('customer_notes', `%[Referrer: ${phone}]%`)
            .eq('status', 'Delivered')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setReferrals(data);
        }
        setIsLoadingReferrals(false);
    };

    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                setForm(parsed);
                fetchOrders(parsed.phone);
                fetchReferrals(parsed.phone);
                // Also fetch latest points from supabase if profile exists
                fetchProfileData(parsed.phone);
            } catch (e) {
                console.error("Failed to parse profile", e);
            }
        }
    }, []);

    const fetchProfileData = async (phone: string) => {
        const { data } = await supabase.from('profiles').select('points, lifetime_points').eq('phone', phone).single();
        if (data) {
            setForm(prev => ({ ...prev, points: data.points, lifetime_points: data.lifetime_points }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Save to Supabase
            const { error } = await supabase
                .from('profiles')
                .insert([{
                    name: form.name,
                    email: form.email,
                    birthday: form.birthday,
                    phone: form.phone,
                    city: form.city,
                    address: form.address
                }]);

            if (error) throw error;

            // Save to local storage for quick access in cart
            localStorage.setItem('userProfile', JSON.stringify(form));
            toast.success("Profile saved securely!");

            // Refresh orders if phone changed
            fetchOrders(form.phone);
        } catch (error) {
            console.error("Error saving profile to database:", error);
            // Fallback to storing locally if db fails so UX is preserved
            localStorage.setItem('userProfile', JSON.stringify(form));
            toast.success("Profile saved locally!");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRedeem = async (points: number, discount: number) => {
        if ((form.points || 0) < points) {
            toast.error("Not enough points!");
            return;
        }

        setIsRedeeming(true);
        try {
            const { data, error } = await supabase.rpc('redeem_points_for_coupon', {
                p_phone: form.phone,
                p_points_to_spend: points,
                p_discount_value: discount
            });

            if (error) throw error;

            setGeneratedCoupon(data);
            setForm(prev => ({ ...prev, points: (prev.points || 0) - points }));
            toast.success(`Redeemed! Your code: ${data}`);
        } catch (err: any) {
            toast.error(err.message || "Redemption failed");
        } finally {
            setIsRedeeming(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-luxury pt-32 pb-20 font-body">
                <div className="container mx-auto px-6 max-w-7xl">

                    {/* Top Navigation & Title */}
                    <AnimatedSection className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="space-y-2">
                            <Link to="/" className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors text-sm font-bold uppercase tracking-widest mb-4">
                                <ArrowLeft size={16} />
                                Back to Home
                            </Link>
                            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">My Profile</h1>
                        </div>

                        {/* Member Tier Card */}
                        <div className="glass-card rounded-2xl px-6 py-4 flex items-center gap-4 border border-primary/20 bg-primary/5">
                            <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center text-card shadow-gold">
                                <Crown size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Membership Status</p>
                                <p className="text-lg font-bold text-foreground">Gold Member</p>
                            </div>
                        </div>
                    </AnimatedSection>

                    <div className="grid lg:grid-cols-12 gap-8">

                        {/* Left Column: Personal Details */}
                        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                            <AnimatedSection delay={0.1}>
                                <div className="glass-card rounded-[2.5rem] p-6 md:p-10 border border-white/20 shadow-premium">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Personal Details</h2>
                                            <p className="text-sm text-muted-foreground mt-1">Manage your identity and shipping info.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSave} className="space-y-6">
                                        <div className="grid gap-6">
                                            {/* Full Name */}
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <User size={12} className="text-primary" /> Full Name
                                                </label>
                                                <input
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/50 border border-border focus:border-primary px-5 py-4 rounded-2xl outline-none transition-all font-medium"
                                                    placeholder="Your Name"
                                                />
                                            </div>

                                            {/* Email & Birthday Row */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                        <Mail size={12} className="text-primary" /> Email
                                                    </label>
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        className="w-full bg-white/50 border border-border focus:border-primary px-5 py-4 rounded-2xl outline-none transition-all font-medium"
                                                        placeholder="email@example.com"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                        <Calendar size={12} className="text-primary" /> Birthday
                                                    </label>
                                                    <input
                                                        name="birthday"
                                                        type="date"
                                                        value={form.birthday}
                                                        onChange={handleChange}
                                                        className="w-full bg-white/50 border border-border focus:border-primary px-5 py-4 rounded-2xl outline-none transition-all font-medium"
                                                    />
                                                </div>
                                            </div>

                                            {/* Phone */}
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <Phone size={12} className="text-primary" /> Phone Number
                                                </label>
                                                <input
                                                    name="phone"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/50 border border-border focus:border-primary px-5 py-4 rounded-2xl outline-none transition-all font-medium"
                                                    placeholder="03XX-XXXXXXX"
                                                />
                                            </div>

                                            {/* City */}
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <MapPin size={12} className="text-primary" /> City
                                                </label>
                                                <input
                                                    name="city"
                                                    value={form.city}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/50 border border-border focus:border-primary px-5 py-4 rounded-2xl outline-none transition-all font-medium"
                                                    placeholder="Your City"
                                                />
                                            </div>

                                            {/* Address */}
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <Home size={12} className="text-primary" /> Shipping Address
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={form.address}
                                                    onChange={handleChange}
                                                    rows={3}
                                                    className="w-full bg-white/50 border border-border focus:border-primary px-5 py-4 rounded-2xl outline-none transition-all font-medium resize-none"
                                                    placeholder="Complete Home Address"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="w-full mt-4 bg-foreground text-background font-bold py-5 rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-luxury flex items-center justify-center gap-3 active:scale-[0.98]"
                                        >
                                            {isSaving ? <Save className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </form>
                                </div>
                            </AnimatedSection>

                            {/* Reward Points Card */}
                            <AnimatedSection delay={0.15}>
                                <div className="glass-card rounded-[2.5rem] p-8 border border-white/20 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-premium mt-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full translate-x-12 -translate-y-12" />
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Cure Points</h2>
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Loyalty Rewards</p>
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center text-card shadow-gold">
                                            <Sparkles size={28} />
                                        </div>
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        <div className="flex items-end gap-3">
                                            <span className="text-5xl font-bold text-foreground tabular-nums">{form.points || 0}</span>
                                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Available Points</span>
                                        </div>

                                        <div className="w-full h-2 bg-border/40 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(((form.points || 0) / 1000) * 100, 100)}%` }}
                                                className="h-full bg-gradient-gold"
                                            />
                                        </div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {1000 - (form.points || 0) > 0
                                                ? `${1000 - (form.points || 0)} more points to unlock Elite status`
                                                : "Elite Status Reached"}
                                        </p>

                                        <button
                                            onClick={() => setShowRedeemModal(true)}
                                            className="w-full bg-white/50 border border-border hover:border-primary/50 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-white flex items-center justify-center gap-2"
                                        >
                                            <Package size={16} className="text-primary" />
                                            Redeem Rewards
                                        </button>
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Refer a Friend Card */}
                            <AnimatedSection delay={0.2}>
                                <div className="glass-card rounded-[2.5rem] p-8 border border-white/20 bg-gradient-to-br from-indigo-500/5 to-primary/5 shadow-premium mt-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12 group-hover:bg-indigo-500/20 transition-all duration-700" />
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Refer a Friend</h2>
                                            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Community Growth</p>
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                            <Users size={28} />
                                        </div>
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Give your friends <span className="text-foreground font-bold italic">10% OFF</span> their first order and earn <span className="text-primary font-bold">500 Cure Points</span> when they complete their purchase.
                                        </p>

                                        <div className="bg-white/50 border border-border rounded-2xl p-4 flex items-center justify-between gap-4">
                                            <code className="text-[10px] font-mono font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                                                {window.location.origin}/?ref={form.phone || '03...'}
                                            </code>
                                            <button
                                                onClick={() => {
                                                    if (!form.phone) {
                                                        toast.error("Finish your profile first!");
                                                        return;
                                                    }
                                                    const link = `${window.location.origin}/?ref=${form.phone}`;
                                                    navigator.clipboard.writeText(link);
                                                    toast.success("Link copied!");
                                                }}
                                                className="shrink-0 p-2 hover:bg-white rounded-lg transition-colors text-primary"
                                            >
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (!form.phone) {
                                                    toast.error("Finish your profile first!");
                                                    return;
                                                }
                                                const link = `${window.location.origin}/?ref=${form.phone}`;
                                                const msg = encodeURIComponent(`Hey! Check out The Essential Cure for natural hair care. Use my link to get 10% OFF your first order: ${link}`);
                                                window.open(`https://wa.me/?text=${msg}`, '_blank');
                                            }}
                                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20 active:scale-95 mb-8"
                                        >
                                            <MessageSquare size={18} />
                                            Share via WhatsApp
                                        </button>

                                        {/* Referral History */}
                                        <div className="space-y-4 pt-4 border-t border-white/20">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Successful Referrals</h3>
                                                {referrals.length > 0 && (
                                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                        {referrals.length} friends joined
                                                    </span>
                                                )}
                                            </div>

                                            {isLoadingReferrals ? (
                                                <div className="p-4 flex items-center justify-center animate-pulse text-muted-foreground">
                                                    <Clock size={16} className="animate-spin mr-2" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Loading status...</span>
                                                </div>
                                            ) : referrals.length > 0 ? (
                                                <div className="space-y-3">
                                                    {referrals.map((refOrder) => (
                                                        <div key={refOrder.id} className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/20">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-600">
                                                                    <CheckCircle2 size={14} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[11px] font-bold text-foreground">
                                                                        {refOrder.customer_name.split(' ').map((n: string) => n[0] + '*'.repeat(n.length - 1)).join(' ')}
                                                                    </p>
                                                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">
                                                                        {new Date(refOrder.created_at).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                                                                +500 pts
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-6 text-center rounded-2xl bg-white/20 border border-dashed border-white/40">
                                                    <Users size={24} className="text-muted-foreground/30 mx-auto mb-2" />
                                                    <p className="text-[10px] text-muted-foreground font-bold leading-relaxed uppercase tracking-widest">No successful referrals yet.<br />Your points will appear here!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>

                        {/* Right Column: Order History */}
                        <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                            <AnimatedSection delay={0.2}>
                                <div className="glass-card rounded-[2.5rem] p-6 md:p-10 border border-white/20 shadow-premium h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-10">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Order History</h2>
                                            <p className="text-sm text-muted-foreground mt-1">Track your recent botanical acquisitions.</p>
                                        </div>
                                        {orders.length > 0 && (
                                            <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20">
                                                {orders.length} Total
                                            </div>
                                        )}
                                    </div>

                                    {isLoadingOrders ? (
                                        <div className="flex-grow flex flex-col items-center justify-center py-20 animate-pulse">
                                            <Clock size={48} className="text-primary/20 mb-4 animate-spin-slow" />
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Gathering your history...</p>
                                        </div>
                                    ) : orders.length > 0 ? (
                                        <div className="overflow-x-auto -mx-2">
                                            <table className="w-full text-left min-w-[600px]">
                                                <thead>
                                                    <tr className="border-b border-border">
                                                        <th className="px-4 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Order Tag</th>
                                                        <th className="px-4 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                                                        <th className="px-4 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                                                        <th className="px-4 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Total</th>
                                                        <th className="px-4 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Details</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/50">
                                                    {orders.map((order) => (
                                                        <tr key={order.id} className="group hover:bg-white/50 transition-colors">
                                                            <td className="px-4 py-6">
                                                                <span className="font-mono text-sm font-bold text-foreground group-hover:text-primary transition-colors">{order.id}</span>
                                                            </td>
                                                            <td className="px-4 py-6">
                                                                <p className="text-xs font-medium text-foreground">
                                                                    {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                                                                </p>
                                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                                                    {new Date(order.created_at).getFullYear()}
                                                                </p>
                                                            </td>
                                                            <td className="px-4 py-6">
                                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border
                                                                    ${order.status === 'Delivered' ? 'bg-green-500/10 border-green-200 text-green-700' :
                                                                        order.status === 'Cancelled' ? 'bg-red-500/10 border-red-200 text-red-700' :
                                                                            'bg-primary/10 border-primary/20 text-primary'}`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-6 text-right">
                                                                <span className="text-sm font-bold text-foreground">PKR {order.total_amount.toLocaleString()}</span>
                                                            </td>
                                                            <td className="px-4 py-6 text-right">
                                                                <Link
                                                                    to={`/track?id=${order.id}`}
                                                                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline group/link"
                                                                >
                                                                    View Order
                                                                    <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
                                            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6">
                                                <Package size={32} className="text-muted-foreground/30" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-2">No Acquisitions Yet</h3>
                                            <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">Your natural hair journey hasn't started yet. Let's find your cure.</p>
                                            <Link
                                                to="/shop"
                                                className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-gold hover:shadow-premium transition-all active:scale-95"
                                            >
                                                Visit Shop
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {/* Redemption Modal */}
            <AnimatePresence>
                {showRedeemModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card max-w-lg w-full rounded-[2.5rem] p-10 border border-white/20 shadow-premium relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-3xl rounded-full translate-x-20 -translate-y-20" />

                            <button onClick={() => { setShowRedeemModal(false); setGeneratedCoupon(null); }} className="absolute top-8 right-8 text-muted-foreground hover:text-foreground">
                                <Search className="rotate-45" size={24} />
                            </button>

                            <div className="text-center mb-10">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-gold flex items-center justify-center text-card shadow-gold mx-auto mb-6">
                                    <Sparkles size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-foreground">Redeem Cure Points</h2>
                                <p className="text-sm text-muted-foreground mt-2">Convert your loyalty into exclusive discounts.</p>
                            </div>

                            {generatedCoupon ? (
                                <div className="space-y-6 text-center">
                                    <div className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-3xl p-8">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">Your One-Time Coupon Code</p>
                                        <h3 className="text-4xl font-mono font-bold text-foreground tracking-widest">{generatedCoupon}</h3>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedCoupon);
                                            toast.success("Code copied to clipboard!");
                                        }}
                                        className="w-full bg-foreground text-background font-bold py-5 rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-3"
                                    >
                                        Copy & Close
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={`p-6 rounded-3xl border transition-all ${(form.points || 0) >= 500 ? 'bg-primary/5 border-primary/20' : 'bg-muted/10 border-border opacity-50'}`}>
                                        <h4 className="text-lg font-bold text-foreground">10% OFF</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Requires 500 Points</p>
                                        <button
                                            disabled={isRedeeming || (form.points || 0) < 500}
                                            onClick={() => handleRedeem(500, 10)}
                                            className="w-full mt-6 bg-white border border-border hover:border-primary py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                                        >
                                            {isRedeeming ? "Processing..." : "Redeem Now"}
                                        </button>
                                    </div>
                                    <div className={`p-6 rounded-3xl border transition-all ${(form.points || 0) >= 1000 ? 'bg-primary/5 border-primary/20' : 'bg-muted/10 border-border opacity-50'}`}>
                                        <h4 className="text-lg font-bold text-foreground">20% OFF</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Requires 1000 Points</p>
                                        <button
                                            disabled={isRedeeming || (form.points || 0) < 1000}
                                            onClick={() => handleRedeem(1000, 20)}
                                            className="w-full mt-6 bg-white border border-border hover:border-primary py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                                        >
                                            {isRedeeming ? "Processing..." : "Redeem Now"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <p className="text-[10px] text-center text-muted-foreground mt-8 uppercase tracking-widest font-bold">
                                Available Balance: {form.points || 0} Points
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Profile;
