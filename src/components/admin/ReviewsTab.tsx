import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, Plus, Edit2, Trash2, ToggleRight, ToggleLeft,
    CheckCircle2, Loader2, MessageCircle, Upload, X
} from 'lucide-react';
import { EmptyState } from './EmptyState';

interface ReviewsTabProps {
    reviews: any[];
    showAddReview: boolean;
    setShowAddReview: (s: boolean) => void;
    newReview: any;
    setNewReview: (r: any) => void;
    createReview: () => void;
    savingReview: boolean;
    editingReview: any;
    setEditingReview: (r: any) => void;
    updateReview: () => void;
    toggleReview: (id: number, active: boolean) => void;
    deleteReview: (id: number) => void;
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
    reviews, showAddReview, setShowAddReview, newReview,
    setNewReview, createReview, savingReview, editingReview,
    setEditingReview, updateReview, toggleReview, deleteReview,
    selectedFile, setSelectedFile
}) => {
    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Customer Reviews</p>
                    </div>
                    <h2 className="text-4xl font-bold text-foreground tracking-tight uppercase tracking-tighter">Review List</h2>
                </div>
                <button
                    onClick={() => setShowAddReview(true)}
                    className="h-14 px-10 bg-obsidian text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-gold active:scale-95 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span>Add New Review</span>
                </button>
            </div>

            <AnimatePresence>
                {showAddReview && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-luxury space-y-8 max-w-3xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                        <div>
                            <h3 className="text-xl font-bold text-foreground uppercase tracking-tight mb-2">Add Review</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Add a new customer review to the website.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Customer Name</label>
                                <input
                                    type="text"
                                    value={newReview.name}
                                    onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                                    className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all shadow-inner placeholder:text-muted-foreground/30"
                                    placeholder="Customer Name"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Location</label>
                                <input
                                    type="text"
                                    value={newReview.location}
                                    onChange={e => setNewReview({ ...newReview, location: e.target.value })}
                                    className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all shadow-inner placeholder:text-muted-foreground/30"
                                    placeholder="Dubai, UAE"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Review Photo (Optional)</label>
                            {!selectedFile ? (
                                <label className="w-full h-32 bg-white/10 border-2 border-dashed border-white/40 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all group/upload">
                                    <Upload size={20} className="text-muted-foreground group-hover/upload:text-primary transition-colors mb-2" />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select Image</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                                </label>
                            ) : (
                                <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-white/40 group/preview">
                                    <img src={URL.createObjectURL(selectedFile)} className="w-full h-full object-cover" alt="Preview" />
                                    <button onClick={() => setSelectedFile(null)} className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-black/60 text-white flex items-center justify-center hover:bg-black transition-all">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                            {newReview.image_url && !selectedFile && (
                                <div className="text-[8px] font-bold text-primary uppercase tracking-widest">Existing URL: {newReview.image_url.slice(0, 30)}...</div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Review Text</label>
                            <textarea
                                rows={4}
                                value={newReview.review}
                                onChange={e => setNewReview({ ...newReview, review: e.target.value })}
                                className="w-full bg-white/20 border border-white/40 px-6 py-4 rounded-2xl text-sm font-medium outline-none resize-none focus:border-primary transition-all shadow-inner placeholder:text-muted-foreground/30"
                                placeholder="Write review here..."
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                disabled={savingReview}
                                onClick={createReview}
                                className="flex-[2] h-14 bg-obsidian text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-premium active:scale-95 flex items-center justify-center gap-3"
                            >
                                {savingReview ? <Loader2 size={16} className="animate-spin" /> : "Add Review"}
                            </button>
                            <button
                                onClick={() => setShowAddReview(false)}
                                className="flex-1 h-14 bg-white/40 border border-white/40 text-muted-foreground rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-foreground transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.length === 0 ? (
                    <div className="col-span-full py-40 glass-card rounded-[4rem] border border-white/40 shadow-premium flex items-center justify-center">
                        <EmptyState
                            icon={MessageCircle}
                            title="No Reviews"
                            description="There are no customer reviews to show right now."
                        />
                    </div>
                ) : (
                    reviews.map((r) => (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium relative overflow-hidden group hover:border-primary/40 transition-all hover:-translate-y-2 hover:shadow-luxury flex flex-col"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-colors group-hover:bg-primary/10" />

                            {editingReview?.id === r.id ? (
                                <div className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" value={editingReview.name} onChange={e => setEditingReview({ ...editingReview, name: e.target.value })} className="bg-white/40 border border-white/40 px-5 py-3 rounded-2xl text-xs font-bold outline-none focus:border-primary tracking-tight" placeholder="Name" />
                                        <input type="text" value={editingReview.location} onChange={e => setEditingReview({ ...editingReview, location: e.target.value })} className="bg-white/40 border border-white/40 px-5 py-3 rounded-2xl text-xs font-bold outline-none focus:border-primary tracking-tight" placeholder="Location" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-2">Edit Photo</label>
                                        {!selectedFile && !editingReview.image_url ? (
                                            <label className="w-full h-24 bg-white/10 border-2 border-dashed border-white/40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all">
                                                <Upload size={16} className="text-muted-foreground mb-1" />
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase">Upload</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                                            </label>
                                        ) : (
                                            <div className="relative w-full h-24 rounded-xl overflow-hidden border border-white/40">
                                                <img src={selectedFile ? URL.createObjectURL(selectedFile) : editingReview.image_url} className="w-full h-full object-cover" alt="Preview" />
                                                <button onClick={() => { setSelectedFile(null); if (!selectedFile) setEditingReview({ ...editingReview, image_url: '' }); }} className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-black">
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <textarea rows={4} value={editingReview.review} onChange={e => setEditingReview({ ...editingReview, review: e.target.value })} className="w-full bg-white/40 border border-white/40 px-5 py-3 rounded-2xl text-xs font-medium outline-none focus:border-primary resize-none" placeholder="Review Message" />
                                    <div className="flex gap-3">
                                        <button disabled={savingReview} onClick={updateReview} className="flex-[2] h-12 bg-obsidian text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-premium">
                                            {savingReview ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />} Save
                                        </button>
                                        <button onClick={() => setEditingReview(null)} className="flex-1 h-12 bg-white/40 border border-white/40 text-muted-foreground rounded-2xl text-[10px] font-bold uppercase hover:bg-white transition-all">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start justify-between mb-8 relative z-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-obsidian border border-white/10 flex items-center justify-center text-white font-bold text-xl shadow-premium group-hover:scale-110 transition-transform duration-500">
                                                {r.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground tracking-tight text-[11px] uppercase ml-1 group-hover:text-primary transition-colors">{r.name}</h4>
                                                <div className="flex items-center gap-3 mt-1.5 bg-white/20 px-3 py-1 rounded-full border border-white/40 backdrop-blur-sm">
                                                    <div className="flex text-secondary gap-0.5">
                                                        {[...Array(5)].map((_, i) => <Star key={i} size={8} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "text-secondary" : "text-white/20"} strokeWidth={3} />)}
                                                    </div>
                                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{r.location || 'WORLDWIDE'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleReview(r.id, !r.active)}
                                                className={`w-10 h-10 rounded-2xl transition-all flex items-center justify-center border ${r.active ? 'bg-white/40 border-white/40 text-secondary' : 'bg-obsidian border-white/10 text-white'}`}
                                            >
                                                {r.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                            </button>
                                            <button onClick={() => setEditingReview(r)} className="w-10 h-10 rounded-2xl bg-white/40 border border-white/40 text-muted-foreground hover:bg-obsidian hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm flex items-center justify-center"><Edit2 size={16} /></button>
                                            <button onClick={() => deleteReview(r.id)} className="w-10 h-10 rounded-2xl bg-white/40 border border-white/40 text-muted-foreground hover:bg-red-500 hover:text-white hover:border-red-500 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <div className="relative mb-8 flex-1 z-10">
                                        {r.image_url && (
                                            <div className="h-48 w-full bg-white/20 rounded-[2rem] overflow-hidden mb-6 border border-white/40 shadow-inner group/img">
                                                <img src={r.image_url} alt="Review Visualization" className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110 blur-sm group-hover/img:blur-none" />
                                            </div>
                                        )}
                                        <div className="flex flex-wrap items-center gap-3 mb-6">
                                            {r.tag && <span className="text-[8px] font-bold bg-obsidian text-white border border-white/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-premium">{r.tag}</span>}
                                            {r.verified && <span className="text-[8px] font-bold bg-secondary/10 text-secondary px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-secondary/20 flex items-center gap-2 backdrop-blur-sm shadow-inner"><CheckCircle2 size={10} /> Verified</span>}
                                        </div>
                                        <p className="text-[13px] text-foreground font-medium leading-[1.8] italic opacity-80 group-hover:opacity-100 transition-opacity">"{r.review}"</p>
                                    </div>

                                    <div className="mt-auto pt-8 border-t border-white/20 flex items-center justify-between z-10">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.3em] font-mono">Review Date</span>
                                            <span className="text-[9px] font-bold text-foreground/60 uppercase tracking-[0.1em] mt-1">{new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/10 flex items-center justify-center text-muted-foreground opacity-40">
                                            <MessageCircle size={14} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};
