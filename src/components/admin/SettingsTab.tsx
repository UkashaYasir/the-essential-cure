import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings as SettingsIcon, Save, Truck, Banknote,
    Smartphone, Megaphone, Clock, Plus, Trash2,
    CreditCard, MapPin, Zap, ShoppingCart, Percent,
    Building2, UserCheck, Loader2
} from 'lucide-react';

interface SettingsTabProps {
    config: any;
    setConfig: (c: any) => void;
    updateConfig: () => void;
    saving: boolean;
    cityInput: string;
    setCityInput: (s: string) => void;
    daysInput: string;
    setDaysInput: (s: string) => void;
    addCityPair: () => void;
    removeCityPair: (city: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
    config, setConfig, updateConfig, saving,
    cityInput, setCityInput, daysInput, setDaysInput,
    addCityPair, removeCityPair
}) => {
    if (!config) return null;

    const addBankAccount = () => {
        const next = [...(config.bank_accounts || []), { id: Date.now().toString(), bankName: '', accountTitle: '', accountNumber: '' }];
        setConfig({ ...config, bank_accounts: next });
    };

    const removeBankAccount = (id: string) => {
        const next = config.bank_accounts.filter((b: any) => b.id !== id);
        setConfig({ ...config, bank_accounts: next });
    };

    const updateBankAccount = (id: string, field: string, value: string) => {
        const next = config.bank_accounts.map((b: any) => b.id === id ? { ...b, [field]: value } : b);
        setConfig({ ...config, bank_accounts: next });
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 max-w-[1400px] pb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/20">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">Main Settings</p>
                    </div>
                    <h2 className="text-5xl font-bold text-foreground tracking-tighter uppercase">Store Configuration</h2>
                </div>
                <button
                    onClick={updateConfig}
                    disabled={saving}
                    className="h-16 px-12 bg-obsidian text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-gold active:scale-95 disabled:opacity-50 group"
                >
                    {saving ? (
                        <Loader2 size={18} className="animate-spin text-secondary" />
                    ) : (
                        <>
                            <Save size={18} className="group-hover:translate-y-[-2px] transition-transform" />
                            <span>Save Settings</span>
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Column 1: Core Operations */}
                <div className="space-y-10">
                    <section className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-obsidian flex items-center justify-center text-white shadow-premium">
                                <Zap size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Store Status</h3>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">On/Off Controls</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-6 bg-white/20 rounded-[2rem] border border-white/40 backdrop-blur-md group/toggle">
                                <div>
                                    <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">Store Status</p>
                                    <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">Accepting Orders</p>
                                </div>
                                <button
                                    onClick={() => setConfig({ ...config, accepting_orders: !config.accepting_orders })}
                                    className={`w-14 h-7 rounded-full transition-all relative shadow-inner border border-white/20 ${config.accepting_orders ? 'bg-secondary shadow-luxury-deep' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${config.accepting_orders ? 'left-[34px]' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-white/20 rounded-[2rem] border border-white/40 backdrop-blur-md group/toggle">
                                <div>
                                    <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">Flash Sale</p>
                                    <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">Activate Discount</p>
                                </div>
                                <button
                                    onClick={() => setConfig({ ...config, is_sale_active: !config.is_sale_active })}
                                    className={`w-14 h-7 rounded-full transition-all relative shadow-inner border border-white/20 ${config.is_sale_active ? 'bg-obsidian shadow-luxury-deep' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${config.is_sale_active ? 'left-[34px]' : 'left-1'}`} />
                                </button>
                            </div>

                            <AnimatePresence>
                                {config.is_sale_active && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 px-2 overflow-hidden"
                                    >
                                        <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Sale Magnitude (Multiplier)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={config.sale_multiplier}
                                                onChange={e => setConfig({ ...config, sale_multiplier: Number(e.target.value) })}
                                                className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-xs font-bold outline-none focus:border-primary transition-all shadow-inner"
                                            />
                                            <Percent size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/30" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>

                    <section className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium space-y-8 relative overflow-hidden group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-obsidian flex items-center justify-center text-white shadow-premium">
                                <Percent size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Quantity Discounts</h3>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Bundle Deals</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Buy 2 Items Price (PKR)</label>
                                <input type="number" value={config.bundle_discount_qty2} onChange={e => setConfig({ ...config, bundle_discount_qty2: Number(e.target.value) })} className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-xs font-bold outline-none font-mono focus:border-primary transition-all shadow-inner" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Buy 3 Items Price (PKR)</label>
                                <input type="number" value={config.bundle_discount_qty3} onChange={e => setConfig({ ...config, bundle_discount_qty3: Number(e.target.value) })} className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-xs font-bold outline-none font-mono focus:border-primary transition-all shadow-inner" />
                            </div>
                        </div>
                    </section>

                    <section className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium space-y-8 relative overflow-hidden group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-obsidian flex items-center justify-center text-white shadow-premium">
                                <Smartphone size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">WhatsApp Link</h3>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Customer Support</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">WhatsApp Number</label>
                            <input type="text" value={config.whatsapp_number} onChange={e => setConfig({ ...config, whatsapp_number: e.target.value })} className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-xs font-bold outline-none focus:border-primary transition-all font-mono shadow-inner tracking-widest" />
                        </div>
                    </section>
                </div>

                {/* Column 2: Financial Ledger */}
                <div className="space-y-10">
                    <section className="bg-obsidian p-10 rounded-[4rem] border border-white/10 shadow-luxury space-y-10 h-full relative overflow-hidden group">
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-obsidian flex items-center justify-center text-white shadow-premium">
                                    <Building2 size={20} className="text-secondary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-wider">Bank Accounts</h3>
                                    <p className="text-[8px] font-bold text-white/60 uppercase tracking-[0.2em]">Where you receive payments</p>
                                </div>
                            </div>
                            <button onClick={addBankAccount} className="w-10 h-10 bg-white/40 border border-white/40 text-foreground rounded-xl hover:bg-obsidian hover:text-white transition-all flex items-center justify-center shadow-sm">
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="space-y-6 relative z-10 max-h-[600px] overflow-y-auto no-scrollbar pr-4">
                            {config.bank_accounts?.map((bank: any) => (
                                <motion.div
                                    key={bank.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-8 bg-white/10 rounded-[2.5rem] border border-white/10 backdrop-blur-md space-y-6 group/bank relative overflow-hidden shadow-luxury hover:border-primary/40 transition-all active:scale-98"
                                >
                                    <button onClick={() => removeBankAccount(bank.id)} className="absolute top-6 right-6 text-muted-foreground/40 hover:text-red-500 transition-colors opacity-0 group-bank-hover:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="space-y-4">
                                        <input
                                            placeholder="Bank Name"
                                            value={bank.bankName}
                                            onChange={e => updateBankAccount(bank.id, 'bankName', e.target.value)}
                                            className="w-full bg-transparent border-b border-white/20 py-2 text-xs font-bold text-white uppercase tracking-[0.2em] outline-none focus:border-primary transition-all"
                                        />
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-bold text-white/50 uppercase tracking-widest ml-1">Title</label>
                                                <input
                                                    placeholder="Account Title"
                                                    value={bank.accountTitle}
                                                    onChange={e => updateBankAccount(bank.id, 'accountTitle', e.target.value)}
                                                    className="w-full bg-white/5 px-4 py-2 rounded-xl text-[11px] font-medium text-white outline-none border border-white/10"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-bold text-white/50 uppercase tracking-widest ml-1">Credential</label>
                                                <input
                                                    placeholder="Account Number"
                                                    value={bank.accountNumber}
                                                    onChange={e => updateBankAccount(bank.id, 'accountNumber', e.target.value)}
                                                    className="w-full bg-white/5 px-4 py-2 rounded-xl text-[11px] font-mono font-bold text-white outline-none border border-white/10 tracking-widest"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {(!config.bank_accounts || config.bank_accounts.length === 0) && (
                                <div className="py-20 text-center border-2 border-dashed border-white/20 rounded-[3rem] bg-white/5 backdrop-blur-sm">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">No Bank Accounts Added</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-10 border-t border-white/20 space-y-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-inner">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-wider uppercase">JazzCash Account</h3>
                                    <p className="text-[8px] font-bold text-white/50 uppercase tracking-[0.2em]">Mobile Wallet Payments</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold text-white/50 uppercase tracking-[0.3em] ml-2">Account Title</label>
                                    <input type="text" value={config.jazzcash_name} onChange={e => setConfig({ ...config, jazzcash_name: e.target.value })} className="w-full bg-white/10 border border-white/10 px-6 py-4 rounded-2xl text-xs font-bold text-white outline-none focus:border-primary transition-all shadow-inner" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold text-white/50 uppercase tracking-[0.3em] ml-2">Mobile Number</label>
                                    <input type="text" value={config.jazzcash_number} onChange={e => setConfig({ ...config, jazzcash_number: e.target.value })} className="w-full bg-white/10 border border-white/10 px-6 py-4 rounded-2xl text-xs font-bold text-white font-mono outline-none focus:border-primary transition-all shadow-inner tracking-widest" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Column 3: Logistics & Atmosphere */}
                <div className="space-y-10">
                    <section className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium space-y-8 relative overflow-hidden group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-obsidian flex items-center justify-center text-white shadow-premium">
                                <Truck size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Shipping Times</h3>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Delivery Days by City</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="flex gap-3">
                                <input type="text" placeholder="City" value={cityInput} onChange={e => setCityInput(e.target.value)} className="flex-[2] bg-white/20 border border-white/40 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase outline-none focus:border-primary transition-all shadow-inner" />
                                <input type="text" placeholder="Days" value={daysInput} onChange={e => setDaysInput(e.target.value)} className="flex-1 bg-white/20 border border-white/40 px-5 py-4 rounded-2xl text-[10px] font-bold outline-none focus:border-primary transition-all shadow-inner" />
                                <button onClick={addCityPair} className="bg-obsidian text-white w-14 h-14 rounded-2xl hover:bg-black transition-all flex items-center justify-center shadow-premium active:scale-95"><Plus size={20} /></button>
                            </div>
                            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto no-scrollbar pr-2">
                                {Object.entries(config.city_delivery_days || {}).map(([city, days]) => (
                                    <motion.div
                                        key={city}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center justify-between p-5 bg-white/10 rounded-2xl border border-white/20 group/city backdrop-blur-sm"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-foreground uppercase tracking-widest leading-none mb-2">{city}</span>
                                            <span className="text-[9px] font-mono font-bold text-secondary uppercase tracking-[0.2em]">{days as string} DAYS</span>
                                        </div>
                                        <button onClick={() => removeCityPair(city)} className="w-8 h-8 rounded-lg text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"><Trash2 size={14} /></button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium space-y-8 relative overflow-hidden group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-obsidian flex items-center justify-center text-white shadow-premium">
                                <Megaphone size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Announcements</h3>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Banner Messages</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Top Banner Text</label>
                                <textarea rows={3} value={config.announcement_text} onChange={e => setConfig({ ...config, announcement_text: e.target.value })} className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-[11px] font-medium outline-none focus:border-primary resize-none shadow-inner leading-relaxed italic" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Shutdown Notice</label>
                                <textarea rows={2} value={config.store_closed_message} onChange={e => setConfig({ ...config, store_closed_message: e.target.value })} className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-[11px] font-medium outline-none focus:border-primary resize-none shadow-inner leading-relaxed" />
                            </div>
                        </div>
                    </section>

                    <section className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-obsidian flex items-center justify-center text-white shadow-premium">
                                <Clock size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Time Settings</h3>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Auto-Actions</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Cancel Order Time (mins)</label>
                                <input type="number" value={config.cancellation_window_mins} onChange={e => setConfig({ ...config, cancellation_window_mins: Number(e.target.value) })} className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-xs font-bold outline-none font-mono focus:border-primary shadow-inner" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Low Stock Alert Level</label>
                                <input type="number" value={config.low_stock_threshold} onChange={e => setConfig({ ...config, low_stock_threshold: Number(e.target.value) })} className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-xs font-bold outline-none font-mono focus:border-primary shadow-inner" />
                            </div>
                        </div>
                    </section>

                    <section className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-obsidian flex items-center justify-center text-white shadow-premium">
                                <Zap size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground">Automations</h3>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">App Connect</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Abandoned Cart Link (URL)</label>
                            <input type="url" placeholder="https://your-webhook-url.com/..." value={config.cart_recovery_webhook || ''} onChange={e => setConfig({ ...config, cart_recovery_webhook: e.target.value })} className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-[10px] font-mono font-bold outline-none focus:border-primary shadow-inner truncate" />
                            <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest px-2 opacity-60">Message sent 30m after abandon.</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
