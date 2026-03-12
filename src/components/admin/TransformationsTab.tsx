import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Plus, Edit2, Trash2, ToggleRight, ToggleLeft,
    CheckCircle2, Loader2, Camera, Upload, X, Tag, Clock, User
} from 'lucide-react';
import { EmptyState } from './EmptyState';

interface TransformationsTabProps {
    transformations: any[];
    products: any[];
    showAddTransformation: boolean;
    setShowAddTransformation: (s: boolean) => void;
    newTransformation: any;
    setNewTransformation: (t: any) => void;
    createTransformation: () => void;
    savingTransformation: boolean;
    editingTransformation: any;
    setEditingTransformation: (t: any) => void;
    updateTransformation: () => void;
    toggleTransformation: (id: string, verified: boolean) => void;
    deleteTransformation: (id: string) => void;
    beforeFile: File | null;
    setBeforeFile: (file: File | null) => void;
    afterFile: File | null;
    setAfterFile: (file: File | null) => void;
}

const CONCERNS = ["Hair Fall", "Scalp Health", "Shine", "Growth"];

export const TransformationsTab: React.FC<TransformationsTabProps> = ({
    transformations, products, showAddTransformation, setShowAddTransformation,
    newTransformation, setNewTransformation, createTransformation, savingTransformation,
    editingTransformation, setEditingTransformation, updateTransformation,
    toggleTransformation, deleteTransformation, beforeFile, setBeforeFile,
    afterFile, setAfterFile
}) => {
    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Transformation Hub</p>
                    </div>
                    <h2 className="text-4xl font-bold text-foreground tracking-tight uppercase tracking-tighter">Results Manager</h2>
                </div>
                <button
                    onClick={() => setShowAddTransformation(true)}
                    className="h-14 px-10 bg-primary text-primary-foreground rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-gold active:scale-95 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span>Post New Result</span>
                </button>
            </div>

            <AnimatePresence>
                {showAddTransformation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-luxury space-y-8 max-w-4xl overflow-hidden relative"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Before/After Uploads */}
                            <div className="space-y-6">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2 font-mono">Visual Evidence</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        {!beforeFile ? (
                                            <label className="aspect-[4/5] bg-white/10 border-2 border-dashed border-white/40 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all group/upload">
                                                <Camera size={20} className="text-muted-foreground group-hover/upload:text-primary transition-colors mb-2" />
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center px-4">Before Photo</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={e => setBeforeFile(e.target.files?.[0] || null)} />
                                            </label>
                                        ) : (
                                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/40 group/preview">
                                                <img src={URL.createObjectURL(beforeFile)} className="w-full h-full object-cover" alt="Before" />
                                                <button onClick={() => setBeforeFile(null)} className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-black/60 text-white flex items-center justify-center hover:bg-black transition-all">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {!afterFile ? (
                                            <label className="aspect-[4/5] bg-white/10 border-2 border-dashed border-white/40 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all group/upload">
                                                <Camera size={20} className="text-muted-foreground group-hover/upload:text-primary transition-colors mb-2" />
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center px-4">After Photo</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={e => setAfterFile(e.target.files?.[0] || null)} />
                                            </label>
                                        ) : (
                                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/40 group/preview border-primary/50">
                                                <img src={URL.createObjectURL(afterFile)} className="w-full h-full object-cover" alt="After" />
                                                <button onClick={() => setAfterFile(null)} className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-black/60 text-white flex items-center justify-center hover:bg-black transition-all">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] font-mono ml-2">Customer Details</label>
                                    <div className="flex gap-4">
                                        <div className="relative flex-1 group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={14} />
                                            <input
                                                type="text"
                                                value={newTransformation.customer_name}
                                                onChange={e => setNewTransformation({ ...newTransformation, customer_name: e.target.value })}
                                                className="w-full bg-white/20 border border-white/40 pl-11 pr-6 py-4 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all shadow-inner placeholder:text-muted-foreground/30"
                                                placeholder="Customer Name"
                                            />
                                        </div>
                                        <div className="relative flex-1 group">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={14} />
                                            <input
                                                type="text"
                                                value={newTransformation.duration}
                                                onChange={e => setNewTransformation({ ...newTransformation, duration: e.target.value })}
                                                className="w-full bg-white/20 border border-white/40 pl-11 pr-6 py-4 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all shadow-inner placeholder:text-muted-foreground/30"
                                                placeholder="Duration (e.g. 4 Weeks)"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] font-mono ml-2">Hair Concern</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CONCERNS.map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setNewTransformation({ ...newTransformation, concern: c })}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${newTransformation.concern === c ? 'bg-primary text-white border-primary shadow-premium' : 'bg-white/20 border-white/40 text-muted-foreground hover:border-primary/50'}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] font-mono ml-2">Linked Product & Review</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <select
                                            value={newTransformation.product_id || ''}
                                            onChange={e => setNewTransformation({ ...newTransformation, product_id: parseInt(e.target.value) })}
                                            className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-xs font-bold outline-none focus:border-primary transition-all shadow-inner"
                                        >
                                            <option value="">Select Product</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <div className="relative group">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary" size={12} />
                                            <input
                                                type="text"
                                                value={newTransformation.review_url || ''}
                                                onChange={e => setNewTransformation({ ...newTransformation, review_url: e.target.value })}
                                                className="w-full bg-white/20 border border-white/40 pl-11 pr-6 py-4 rounded-2xl text-xs font-bold outline-none focus:border-primary transition-all shadow-inner placeholder:text-muted-foreground/30"
                                                placeholder="Review Link (Optional)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10 mt-8">
                            <button
                                disabled={savingTransformation || !beforeFile || !afterFile}
                                onClick={createTransformation}
                                className="flex-[2] h-14 bg-obsidian text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-premium active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {savingTransformation ? <Loader2 size={16} className="animate-spin" /> : <><Upload size={16} /> Publish Transformation</>}
                            </button>
                            <button
                                onClick={() => setShowAddTransformation(false)}
                                className="flex-1 h-14 bg-white/40 border border-white/40 text-muted-foreground rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-foreground transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {transformations.length === 0 ? (
                    <div className="col-span-full py-40 glass-card rounded-[4rem] border border-white/40 shadow-premium flex items-center justify-center">
                        <EmptyState
                            icon={Sparkles}
                            title="No Transformations"
                            description="Start showcasing your customers' hair journeys today."
                        />
                    </div>
                ) : (
                    transformations.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-8 rounded-[2.5rem] border border-white/40 shadow-premium relative overflow-hidden group hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-luxury"
                        >
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <div className="aspect-[4/5] rounded-xl overflow-hidden relative">
                                    <img src={t.before_url} className="w-full h-full object-cover" alt="Before" />
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[7px] font-bold uppercase px-1.5 py-0.5 rounded">Before</div>
                                </div>
                                <div className="aspect-[4/5] rounded-xl overflow-hidden relative border border-primary/20">
                                    <img src={t.after_url} className="w-full h-full object-cover" alt="After" />
                                    <div className="absolute top-2 right-2 bg-primary/80 backdrop-blur-md text-white text-[7px] font-bold uppercase px-1.5 py-0.5 rounded shadow-gold">After</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-bold text-foreground tracking-tight text-xs uppercase">{t.customer_name || 'Anonymous User'}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{t.duration}</span>
                                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                            <span className="text-[8px] font-bold text-primary uppercase tracking-widest">{t.concern}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => toggleTransformation(t.id, !t.verified)}
                                            className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center border ${t.verified ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/20 border-white/20 text-muted-foreground'}`}
                                        >
                                            {t.verified ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-current opacity-30" />}
                                        </button>
                                        <button
                                            onClick={() => deleteTransformation(t.id)}
                                            className="w-8 h-8 rounded-lg bg-white/20 border border-white/20 text-muted-foreground hover:bg-red-500 hover:text-white hover:border-red-500 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {t.product && (
                                    <div className="flex items-center gap-3 bg-white/30 p-2.5 rounded-2xl border border-white/40">
                                        <img src={t.product.image_url} className="w-10 h-10 rounded-lg object-cover bg-white shadow-sm" alt={t.product.name} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Linked Product</p>
                                            <p className="text-[10px] font-bold text-foreground truncate">{t.product.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};
