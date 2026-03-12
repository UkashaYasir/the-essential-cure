import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle2, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

const REASONS = [
    'Damaged / Defective Product',
    'Wrong Item Received',
    'Product Not as Described',
    'Changed My Mind',
    'Quality Issue',
    'Did Not Receive Order',
    'Other',
];

const ReturnRequest = () => {
    useDocumentMeta({ title: 'Return / Refund Request', description: 'Submit a return or refund request for your The Essential Cure order.' });

    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({
        order_id: searchParams.get('id') || '',
        customer_name: '',
        customer_phone: '',
        reason: '',
        details: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.order_id || !form.reason) {
            toast.error('Please fill in all required fields.');
            return;
        }
        setSubmitting(true);
        const { error } = await supabase.from('return_requests').insert([form]);
        setSubmitting(false);
        if (error) {
            toast.error('Failed to submit request. Please try again.');
        } else {
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-cream pt-32 pb-16 font-body flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-3xl p-10 max-w-md w-full mx-6 text-center shadow-luxury"
                    >
                        <CheckCircle2 size={64} className="text-green-500 mx-auto mb-6" />
                        <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Request Submitted!</h2>
                        <p className="text-muted-foreground mb-2">
                            We received your return request for order <strong className="font-mono text-foreground">{form.order_id}</strong>.
                        </p>
                        <p className="text-muted-foreground text-sm mb-8">
                            Our team will review it and contact you on WhatsApp within 24–48 hours.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link to={`/track?id=${form.order_id}`} className="inline-flex items-center justify-center gap-2 bg-gradient-gold text-card font-semibold py-3 rounded-full shadow-luxury">
                                Track My Order
                            </Link>
                            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Back to Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-cream pt-32 pb-16 font-body">
                <div className="container mx-auto px-6 max-w-lg">

                    <div className="mb-6">
                        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mb-6">
                            <ArrowLeft size={16} /> Back
                        </Link>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <RotateCcw size={22} className="text-primary" />
                            </div>
                            <div>
                                <h1 className="font-heading text-2xl font-bold text-foreground">Return / Refund</h1>
                                <p className="text-sm text-muted-foreground">We'll review your request within 48 hours</p>
                            </div>
                        </div>
                    </div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className="glass-card rounded-2xl p-6 space-y-5 shadow-luxury"
                    >
                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-1.5">Order ID *</label>
                            <input
                                type="text"
                                required
                                value={form.order_id}
                                onChange={e => setForm({ ...form, order_id: e.target.value.toUpperCase() })}
                                placeholder="e.g. ORD-1234567"
                                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-foreground block mb-1.5">Your Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.customer_name}
                                    onChange={e => setForm({ ...form, customer_name: e.target.value })}
                                    placeholder="Full name"
                                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-foreground block mb-1.5">Phone *</label>
                                <input
                                    type="tel"
                                    required
                                    value={form.customer_phone}
                                    onChange={e => setForm({ ...form, customer_phone: e.target.value })}
                                    placeholder="03XX-XXXXXXX"
                                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-1.5">Reason *</label>
                            <select
                                required
                                value={form.reason}
                                onChange={e => setForm({ ...form, reason: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-foreground"
                            >
                                <option value="">— Select a reason —</option>
                                {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-foreground block mb-1.5">Additional Details</label>
                            <textarea
                                rows={4}
                                value={form.details}
                                onChange={e => setForm({ ...form, details: e.target.value })}
                                placeholder="Please describe the issue in detail (optional but helpful)..."
                                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
                            />
                        </div>

                        <div className="pt-2 border-t border-border">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-gradient-gold text-card font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-luxury disabled:opacity-50"
                            >
                                {submitting ? <Loader2 size={18} className="animate-spin" /> : <RotateCcw size={18} />}
                                {submitting ? 'Submitting...' : 'Submit Return Request'}
                            </button>
                            <p className="text-center text-xs text-muted-foreground mt-3">
                                By submitting, you agree to our return policy. Eligible items only.
                            </p>
                        </div>
                    </motion.form>
                </div>
            </div>
        </>
    );
};

export default ReturnRequest;
