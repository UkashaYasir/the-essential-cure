import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag, Plus, Trash2, ToggleRight, ToggleLeft
} from 'lucide-react';
import { EmptyState } from './EmptyState';

interface CouponsTabProps {
    coupons: any[];
    showAddCoupon: boolean;
    setShowAddCoupon: (s: boolean) => void;
    newCoupon: any;
    setNewCoupon: (c: any) => void;
    createCoupon: () => void;
    toggleCoupon: (id: number, active: boolean) => void;
    deleteCoupon: (id: number) => void;
}

export const CouponsTab: React.FC<CouponsTabProps> = ({
    coupons, showAddCoupon, setShowAddCoupon, newCoupon,
    setNewCoupon, createCoupon, toggleCoupon, deleteCoupon
}) => {
    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Discounts</p>
                    </div>
                    <h2 className="text-4xl font-bold text-foreground tracking-tight uppercase tracking-tighter">Coupons</h2>
                </div>
                <button
                    onClick={() => setShowAddCoupon(true)}
                    className="h-14 px-10 bg-obsidian text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-gold active:scale-95 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span>Create Coupon</span>
                </button>
            </div>

            <AnimatePresence>
                {showAddCoupon && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-luxury space-y-8 max-w-3xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                        <div>
                            <h3 className="text-xl font-bold text-foreground uppercase tracking-tight mb-2">New Coupon</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Add a new discount code for your customers.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Coupon Code</label>
                                <input
                                    type="text"
                                    value={newCoupon.code}
                                    onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                    className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-sm font-bold outline-none uppercase tracking-widest focus:border-primary transition-all shadow-inner placeholder:text-muted-foreground/30"
                                    placeholder="CRYSTAL20"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Discount Percentage (%)</label>
                                <input
                                    type="number"
                                    value={newCoupon.value}
                                    onChange={e => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                                    className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all shadow-inner"
                                />
                            </div>
                            <div className="sm:col-span-2 space-y-3">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Usage Limit (e.g. 100 uses, leave blank for unlimited)</label>
                                <input
                                    type="number"
                                    value={newCoupon.usage_limit || ''}
                                    onChange={e => setNewCoupon({ ...newCoupon, usage_limit: e.target.value ? Number(e.target.value) : null })}
                                    className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all shadow-inner"
                                    placeholder="Unlimited"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={createCoupon}
                                className="flex-[2] h-14 bg-obsidian text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-premium active:scale-95"
                            >
                                Save Coupon
                            </button>
                            <button
                                onClick={() => setShowAddCoupon(false)}
                                className="flex-1 h-14 bg-white/40 border border-white/40 text-muted-foreground rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-foreground transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coupons.length === 0 ? (
                    <div className="col-span-full py-40 glass-card rounded-[4rem] border border-white/40 shadow-premium flex items-center justify-center">
                        <EmptyState
                            icon={Tag}
                            title="No Coupons"
                            description="There are no active coupons in the system yet."
                        />
                    </div>
                ) : (
                    coupons.map((c) => (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium relative overflow-hidden group hover:border-primary/40 transition-all hover:-translate-y-2 hover:shadow-luxury"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors" />

                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="bg-obsidian text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-premium border border-white/10 group-hover:scale-105 transition-transform">
                                    <Tag size={16} className="text-secondary" />
                                    <span className="font-mono font-bold text-xs tracking-[0.3em]">{c.code}</span>
                                </div>
                                <div className="flex gap-2 text-muted-foreground">
                                    <button
                                        onClick={() => toggleCoupon(c.id, !c.active)}
                                        className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center border ${c.active ? 'bg-white/40 border-white/40 text-primary active:scale-90 shadow-inner' : 'bg-obsidian border-white/10 text-white'}`}
                                    >
                                        {c.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                    </button>
                                    <button
                                        onClick={() => deleteCoupon(c.id)}
                                        className="w-12 h-12 rounded-2xl bg-white/40 border border-white/40 text-muted-foreground hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center shadow-sm"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <h3 className="text-5xl font-bold text-foreground tracking-tighter group-hover:text-primary transition-colors duration-500">{c.value}% <span className="text-lg uppercase tracking-[0.2em] font-normal opacity-40 ml-1">Off</span></h3>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        <span>Times used</span>
                                        <span className="text-foreground">{c.usage_count} / {c.usage_limit || 'Unlimited'}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden border border-white/20">
                                        <div
                                            className={`h-full transition-all duration-1000 ${c.usage_count >= (c.usage_limit || 999999) ? 'bg-red-500' : 'bg-secondary'}`}
                                            style={{ width: `${c.usage_limit ? Math.min((c.usage_count / c.usage_limit) * 100, 100) : 0}%` }}
                                        />
                                    </div>
                                </div>

                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] font-mono">Status: {c.active ? 'Active' : 'Inactive'}</p>
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/20 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${c.active && (c.usage_limit === null || c.usage_count < c.usage_limit) ? 'bg-secondary animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-muted shadow-inner'}`} />
                                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${c.active && (c.usage_limit === null || c.usage_count < c.usage_limit) ? 'text-secondary' : 'text-muted-foreground'}`}>
                                        {c.active && (c.usage_limit === null || c.usage_count < c.usage_limit) ? 'Can be used' : 'Disabled'}
                                    </span>
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] font-mono">ID: {c.id.toString().padStart(4, '0')} • {new Date(c.created_at).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};
