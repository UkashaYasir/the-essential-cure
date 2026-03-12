import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Edit2, Trash2, ToggleRight, ToggleLeft,
    AlertTriangle, Package, Loader2, Save, Camera, Upload, Image as ImageIcon
} from 'lucide-react';
import { MediaManager } from './MediaManager';
import { EmptyState } from './EmptyState';

interface ProductsTabProps {
    products: any[];
    config: any;
    showAddProduct: boolean;
    setShowAddProduct: (s: boolean) => void;
    newProduct: any;
    setNewProduct: (p: any) => void;
    createProduct: () => void;
    savingProduct: boolean;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'gallery', isEdit?: boolean) => void;
    editingProduct: any;
    setEditingProduct: (p: any) => void;
    updateProductObj: () => void;
    toggleProduct: (id: number, active: boolean) => void;
    deleteProduct: (id: number) => void;
    productVelocity?: Record<number, number>;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
    products, config, showAddProduct, setShowAddProduct,
    newProduct, setNewProduct, createProduct, savingProduct,
    handleImageUpload, editingProduct, setEditingProduct,
    updateProductObj, toggleProduct, deleteProduct, productVelocity = {}
}) => {
    const [isMediaManagerOpen, setIsMediaManagerOpen] = React.useState(false);
    const [mediaTarget, setMediaTarget] = React.useState<{ field: 'image_url' | 'gallery', isEdit: boolean } | null>(null);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Stock Control</p>
                    </div>
                    <h2 className="text-4xl font-bold text-foreground tracking-tight">Product Catalog</h2>
                </div>
                <button
                    onClick={() => setShowAddProduct(true)}
                    className="h-14 px-8 bg-primary text-primary-foreground rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-gold hover:shadow-premium group active:scale-95"
                >
                    <Plus size={18} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span>Add New Product</span>
                </button>
            </div>

            {showAddProduct && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium space-y-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50" />

                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                            <Package className="text-primary" size={24} />
                            Add Product Details
                        </h3>
                        <button onClick={() => setShowAddProduct(false)} className="p-2 hover:bg-white/40 rounded-xl transition-colors text-muted-foreground">
                            <Plus size={20} className="rotate-45" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Product Name</label>
                                <input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:bg-white/60 focus:border-primary transition-all backdrop-blur-sm shadow-inner" placeholder="E.g. The Essential Serum" />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Original Price</label>
                                    <input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="w-full bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-sm font-mono font-bold outline-none focus:bg-white/60 focus:border-primary transition-all backdrop-blur-sm" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Discount Price</label>
                                    <input type="number" value={newProduct.sale_price || ''} onChange={e => setNewProduct({ ...newProduct, sale_price: e.target.value ? Number(e.target.value) : '' })} className="w-full bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-sm font-mono font-bold outline-none focus:bg-white/60 focus:border-primary transition-all backdrop-blur-sm" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Stock Level</label>
                                    <input type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="w-full bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-sm font-mono font-bold outline-none focus:bg-white/60 focus:border-primary transition-all backdrop-blur-sm" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Category</label>
                                    <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:bg-white/60 focus:border-primary transition-all backdrop-blur-sm cursor-pointer">
                                        <option>General</option><option>Hair Care</option><option>Skin Care</option><option>Essentials</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Main Product Image</label>
                                <div className="flex gap-3">
                                    <input type="text" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} className="flex-1 bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-xs font-medium outline-none" placeholder="Link to image" />
                                    <label className="bg-white/60 border border-white/40 p-4 rounded-2xl cursor-pointer hover:bg-white hover:text-primary shadow-sm transition-all flex items-center justify-center shrink-0"><Camera size={20} /><input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'image_url')} /></label>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">More Photos (Gallery)</label>
                                <div className="flex gap-3">
                                    <input type="text" value={newProduct.gallery?.join(', ')} onChange={e => setNewProduct({ ...newProduct, gallery: e.target.value.split(',').map(u => u.trim()) })} className="flex-1 bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-xs font-medium outline-none" placeholder="Links separated by commas" />
                                    <label className="bg-white/60 border border-white/40 p-4 rounded-2xl cursor-pointer hover:bg-white hover:text-primary shadow-sm transition-all flex items-center justify-center shrink-0"><Upload size={20} /><input type="file" className="hidden" accept="image/*" multiple onChange={e => handleImageUpload(e, 'gallery')} /></label>
                                </div>
                            </div>
                            <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2"><ImageIcon size={14} /> Media Library</p>
                                <button
                                    onClick={() => { setMediaTarget({ field: 'image_url', isEdit: false }); setIsMediaManagerOpen(true); }}
                                    className="w-full h-12 bg-white rounded-xl border border-primary/10 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                    Open Media Library
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col justify-end space-y-4">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Product Description</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="w-full bg-white/40 border border-white/40 px-6 py-4 rounded-[2rem] text-sm outline-none focus:bg-white/60 focus:border-primary transition-all backdrop-blur-sm min-h-[120px] resize-none"
                                    placeholder="Describe your product here..."
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={createProduct}
                                    disabled={savingProduct || !newProduct.name || !newProduct.price}
                                    className="flex-1 h-16 bg-primary text-primary-foreground rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 shadow-gold hover:shadow-premium disabled:opacity-30 transition-all active:scale-95"
                                >
                                    {savingProduct ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Save Product
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card rounded-[3rem] border border-white/40 shadow-premium overflow-hidden group hover:-translate-y-2 transition-all duration-500 relative h-full flex flex-col"
                    >
                        {/* Status Float */}
                        <div className="absolute top-6 right-6 z-20">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleProduct(product.id, !product.active); }}
                                className={`p-3 rounded-2xl backdrop-blur-md border border-white/40 shadow-premium transition-all ${product.active ? 'bg-secondary/10 text-secondary' : 'bg-red-500/10 text-red-500'}`}
                            >
                                {product.active ? <ToggleRight size={24} strokeWidth={2.5} /> : <ToggleLeft size={24} strokeWidth={2.5} />}
                            </button>
                        </div>

                        <div className="relative h-64 overflow-hidden">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/10 text-muted-foreground/20">
                                    <Package size={64} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-white border border-white/20">
                                    {product.category || 'General'}
                                </span>
                                {product.stock <= (config?.low_stock_threshold || 10) && (
                                    <span className="px-4 py-1.5 bg-red-500/80 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
                                        <AlertTriangle size={10} /> Low Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-8 space-y-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight mb-2 uppercase tracking-tight">{product.name}</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-secondary' : 'bg-red-500'} shadow-sm`} />
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{product.stock} Available</p>
                                        </div>
                                        {productVelocity[product.id] > 0 && (
                                            <p className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-lg">High Demand</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-foreground font-mono">PKR {product.price.toLocaleString()}</p>
                                    {product.sale_price && (
                                        <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mt-1">On Sale</p>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground/60 leading-relaxed line-clamp-2">
                                {product.description}
                            </p>

                            <div className="flex items-center gap-3 pt-4 mt-auto">
                                <button
                                    onClick={() => setEditingProduct(product)}
                                    className="flex-1 h-12 bg-white/40 hover:bg-white rounded-2xl border border-white/40 text-[10px] font-bold uppercase tracking-widest text-foreground transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Edit2 size={16} /> Edit Product
                                </button>
                                <button
                                    onClick={() => deleteProduct(product.id)}
                                    className="w-12 h-12 bg-red-500/5 hover:bg-red-500 hover:text-white rounded-2xl border border-red-500/20 text-red-500 transition-all flex items-center justify-center shadow-sm active:scale-90"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Editing Product Modal */}
            <AnimatePresence>
                {editingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-obsidian/40 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card rounded-[4rem] w-full max-w-6xl shadow-luxury max-h-[90vh] overflow-y-auto overflow-x-hidden border border-white/40"
                        >
                            <div className="p-12 space-y-12">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Edit Product Details</p>
                                        <h2 className="text-3xl font-bold text-foreground uppercase tracking-tight">Edit {editingProduct.name}</h2>
                                    </div>
                                    <button onClick={() => setEditingProduct(null)} className="p-4 hover:bg-white/40 rounded-2xl transition-all"><Plus size={32} className="rotate-45" /></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Product Name</label>
                                            <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-base font-bold outline-none focus:bg-white/60 focus:border-primary transition-all backdrop-blur-sm shadow-inner" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Price (PKR)</label>
                                                <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className="w-full bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-base font-mono font-bold outline-none" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Discount Price</label>
                                                <input type="number" value={editingProduct.sale_price || ''} onChange={e => setEditingProduct({ ...editingProduct, sale_price: e.target.value ? Number(e.target.value) : '' })} className="w-full bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-base font-mono font-bold outline-none" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Available Stock</label>
                                                <input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} className="w-full bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-base font-mono font-bold outline-none" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Category</label>
                                                <select value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-base font-bold cursor-pointer">
                                                    <option>General</option><option>Hair Care</option><option>Skin Care</option><option>Essentials</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Product Description</label>
                                            <textarea value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full bg-white/40 border border-white/40 px-6 py-5 rounded-[2.5rem] text-sm leading-relaxed min-h-[160px] resize-none outline-none focus:bg-white/60 focus:border-primary transition-all backdrop-blur-sm" />
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Main Image</label>
                                            <div className="flex gap-3 mb-4">
                                                <input type="text" value={editingProduct.image_url} onChange={e => setEditingProduct({ ...editingProduct, image_url: e.target.value })} className="flex-1 bg-white/40 border border-white/40 px-6 py-4 rounded-2xl text-xs font-mono" />
                                                <button onClick={() => { setMediaTarget({ field: 'image_url', isEdit: true }); setIsMediaManagerOpen(true); }} className="p-4 bg-white/60 border border-white/40 rounded-2xl hover:bg-white hover:text-primary transition-all shadow-sm shrink-0"><ImageIcon size={20} /></button>
                                            </div>
                                            <div className="relative h-48 rounded-[2rem] overflow-hidden border border-white/40 shadow-inner group">
                                                <img src={editingProduct.image_url} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between ml-1">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Product Gallery</label>
                                                <button onClick={() => { setMediaTarget({ field: 'gallery', isEdit: true }); setIsMediaManagerOpen(true); }} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Add Photos</button>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4">
                                                {editingProduct.gallery?.map((url: string, i: number) => (
                                                    <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/40 shadow-sm bg-white/20 backdrop-blur-md">
                                                        <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-obsidian/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button onClick={() => setEditingProduct({ ...editingProduct, gallery: editingProduct.gallery.filter((_: any, idx: number) => idx !== i) })} className="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"><Plus size={16} className="rotate-45" /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!editingProduct.gallery || editingProduct.gallery.length === 0) && (
                                                    <div className="col-span-full h-24 border-2 border-dashed border-white/40 rounded-[2rem] flex items-center justify-center text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                                        No photos added yet
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-6 pt-10 border-t border-white/10">
                                    <button onClick={() => setEditingProduct(null)} className="flex-1 h-16 bg-white/20 text-muted-foreground rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/40 hover:text-foreground transition-all">Cancel</button>
                                    <button onClick={updateProductObj} disabled={savingProduct} className="flex-2 h-16 bg-primary text-primary-foreground rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-primary/90 shadow-gold hover:shadow-premium transition-all flex items-center justify-center gap-3">
                                        {savingProduct ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Media Manager Integration */}
            <AnimatePresence>
                {isMediaManagerOpen && mediaTarget && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-obsidian/60 backdrop-blur-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            className="w-full max-w-7xl h-[85vh] bg-white/95 rounded-[4rem] border border-white/40 shadow-luxury overflow-hidden flex flex-col"
                        >
                            <div className="p-10 border-b border-neutral-100 flex items-center justify-between bg-white/50 backdrop-blur-md">
                                <div>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Media Library</p>
                                    <h2 className="text-3xl font-bold flex items-center gap-4 text-foreground tracking-tight">YOUR UPLOADED PHOTOS</h2>
                                </div>
                                <button onClick={() => setIsMediaManagerOpen(false)} className="p-4 hover:bg-neutral-100 rounded-[2rem] transition-all"><Plus size={32} className="rotate-45" /></button>
                            </div>
                            <div className="flex-1 overflow-hidden p-6">
                                <MediaManager
                                    isOpen={isMediaManagerOpen}
                                    onClose={() => setIsMediaManagerOpen(false)}
                                    onSelect={(url) => {
                                        if (mediaTarget.isEdit) {
                                            if (mediaTarget.field === 'gallery') {
                                                setEditingProduct({ ...editingProduct, gallery: [...(editingProduct.gallery || []), url] });
                                            } else {
                                                setEditingProduct({ ...editingProduct, [mediaTarget.field]: url });
                                            }
                                        } else {
                                            if (mediaTarget.field === 'gallery') {
                                                setNewProduct({ ...newProduct, gallery: [...(newProduct.gallery || []), url] });
                                            } else {
                                                setNewProduct({ ...newProduct, [mediaTarget.field]: url });
                                            }
                                        }
                                        setIsMediaManagerOpen(false);
                                    }} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
