import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
    Search, Package, CheckCircle2, Clock, Truck,
    FileCheck, XCircle, ArrowLeft, MessageCircle, Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

type OrderStatus = 'Processing' | 'Pending Payment' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

const STATUS_MESSAGES: Record<string, { emoji: string; msg: string; color: string }> = {
    'Processing': { emoji: '⏳', msg: 'Your order has been received and is being processed.', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    'Pending Payment': { emoji: '💳', msg: 'Waiting for payment verification. Please upload your receipt.', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    'Confirmed': { emoji: '✅', msg: 'Payment confirmed! Your order is being prepared.', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    'Packed': { emoji: '📦', msg: 'Your order has been packed and is ready for dispatch.', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    'Shipped': { emoji: '🚚', msg: 'On the way! Your order has been handed to the courier.', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    'Delivered': { emoji: '🎉', msg: 'Delivered! We hope you love The Essential Cure 🌿', color: 'text-green-700 bg-green-50 border-green-200' },
    'Cancelled': { emoji: '❌', msg: 'This order has been cancelled.', color: 'text-red-600 bg-red-50 border-red-200' },
};

const STEPS = ['Processing', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const TrackingBar = ({ status }: { status: string }) => {
    if (status === 'Cancelled' || status === 'Pending Payment') return null;
    const effective = status === 'Pending Payment' ? 'Processing' : status;
    const currentIndex = Math.max(0, STEPS.indexOf(effective));

    const ICONS: Record<string, any> = {
        Processing: Clock, Confirmed: FileCheck, Packed: Package, Shipped: Truck, Delivered: CheckCircle2
    };

    return (
        <div className="mt-8 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-6">Tracking Journey</h4>
            <div className="relative flex items-center justify-between w-full">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary rounded-full" />
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 rounded-full transition-all duration-700"
                    style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
                />
                {STEPS.map((step, index) => {
                    const Icon = ICONS[step] || Clock;
                    const done = index <= currentIndex;
                    const active = index === currentIndex;
                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 bg-card transition-all duration-300
                ${done ? 'border-green-500 text-green-600' : 'border-border text-muted-foreground'}
                ${active ? 'shadow-[0_0_12px_rgba(34,197,94,0.35)] bg-green-50 scale-110' : ''}`}>
                                <Icon size={15} />
                            </div>
                            <span className={`text-[10px] font-bold absolute -bottom-6 whitespace-nowrap ${active ? 'text-green-600' : done ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const OrderTracking = () => {
    useDocumentMeta({
        title: 'Track Your Order',
        description: 'Track the real-time status of your The Essential Cure order.',
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const [inputId, setInputId] = useState(searchParams.get('id') || '');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState('');

    // Fetch whatsapp number for contact button
    useEffect(() => {
        supabase.from('store_config').select('whatsapp_number').eq('id', 1).single()
            .then(({ data }) => { if (data) setWhatsappNumber(data.whatsapp_number); });
    }, []);

    // Auto-search if ID in URL
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setInputId(id);
            // We no longer auto-search without phone for security
        }
    }, [searchParams]);

    const fetchOrder = async (id: string, phone: string) => {
        if (!id.trim() || !phone.trim()) return;
        setLoading(true);
        setNotFound(false);
        setOrder(null);

        const { data, error } = await supabase
            .from('orders')
            .select('id, status, created_at, quantity, total_amount, payment_method, customer_name, customer_city, customer_phone, cancel_reason')
            .eq('id', id.trim().toUpperCase())
            .eq('customer_phone', phone.trim())
            .single();

        setLoading(false);
        if (error || !data) {
            setNotFound(true);
        } else {
            setOrder(data);
            setSearchParams({ id: data.id });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const phone = (e.currentTarget as any).phone.value;
        fetchOrder(inputId, phone);
    };

    const statusInfo = order ? STATUS_MESSAGES[order.status as string] : null;

    const waLink = (() => {
        if (!order || !whatsappNumber) return '#';
        const num = whatsappNumber.replace(/[^0-9]/g, '');
        const msg = `Hi! I'm checking on my order *${order.id}*. Current status shows *${order.status}*. Can you give me an update? 🙏`;
        return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
    })();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-cream pt-32 pb-16 font-body">
                <div className="container mx-auto px-6 max-w-lg">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package size={32} className="text-primary" />
                        </div>
                        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
                        <p className="text-muted-foreground text-sm">Enter your Order ID to see real-time status</p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="glass-card rounded-2xl p-6 shadow-luxury mb-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2 px-1">Order ID</label>
                                <input
                                    type="text"
                                    required
                                    value={inputId}
                                    onChange={e => setInputId(e.target.value.toUpperCase())}
                                    placeholder="e.g. ORD-4444241"
                                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50 font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2 px-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    placeholder="03XX-XXXXXXX"
                                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !inputId.trim()}
                                className="w-full bg-gradient-gold text-card font-bold px-5 py-4 rounded-xl shadow-luxury hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 mt-2"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                                <span>{loading ? 'Verifying Identity...' : 'Check Status'}</span>
                            </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-4 text-center px-4 leading-relaxed">
                            For security, we require both your <b>Order ID</b> and <b>Phone Number</b> to verify your identity.
                        </p>
                    </form>

                    {/* Result */}
                    <AnimatePresence mode="wait">
                        {/* Not Found */}
                        {notFound && (
                            <motion.div
                                key="notfound"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass-card rounded-2xl p-8 text-center shadow-sm border border-red-100"
                            >
                                <XCircle size={48} className="text-red-400 mx-auto mb-4" />
                                <h3 className="font-bold text-lg text-foreground mb-2">Order Not Found</h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    We couldn't find an order with ID <span className="font-mono font-bold text-foreground">{inputId}</span>. Please double-check and try again.
                                </p>
                                <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#20b558] transition-colors"
                                >
                                    <MessageCircle size={16} /> Contact us on WhatsApp
                                </a>
                            </motion.div>
                        )}

                        {/* Order Found */}
                        {order && !notFound && (
                            <motion.div
                                key="order"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass-card rounded-2xl p-6 shadow-luxury border border-border"
                            >
                                {/* Status Banner */}
                                {statusInfo && (
                                    <div className={`rounded-xl p-4 border mb-6 ${statusInfo.color}`}>
                                        <p className="font-bold text-base">{statusInfo.emoji} {order.status}</p>
                                        <p className="text-sm mt-0.5 opacity-90">{statusInfo.msg}</p>
                                    </div>
                                )}

                                {/* Order Summary */}
                                <div className="space-y-3 mb-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Order ID</span>
                                        <span className="font-mono font-bold text-foreground text-sm">{order.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Customer</span>
                                        <span className="font-semibold text-foreground text-sm">{order.customer_name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">City</span>
                                        <span className="text-foreground text-sm">{order.customer_city}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Items</span>
                                        <span className="text-foreground text-sm">{order.quantity}x The Essential Cure Hair Oil</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Total</span>
                                        <span className="font-bold text-primary">PKR {order.total_amount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Ordered On</span>
                                        <span className="text-foreground text-sm">{new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                {/* Cancellation Reason */}
                                {order.status === 'Cancelled' && order.cancel_reason && (
                                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                                        <p className="text-sm text-red-700"><span className="font-semibold">Reason: </span>{order.cancel_reason}</p>
                                    </div>
                                )}

                                {/* Tracking Progress */}
                                <TrackingBar status={order.status} />

                                {/* CTA Buttons */}
                                <div className="flex flex-col gap-3 mt-10">
                                    <a
                                        href={waLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-full hover:bg-[#20b558] transition-colors text-sm shadow-md"
                                    >
                                        <MessageCircle size={16} /> Got a question? WhatsApp us
                                    </a>
                                    <Link
                                        to="/cart"
                                        className="inline-flex items-center justify-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors py-2"
                                    >
                                        <ArrowLeft size={14} /> Back to Shop
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </>
    );
};

export default OrderTracking;
