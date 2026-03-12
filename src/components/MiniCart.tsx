import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Minus, Plus, Trash2, ArrowRight, PackagePlus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function MiniCart() {
    const { items, isCartOpen, closeCart, updateQuantity, removeItem, total, addItem } = useCartStore();
    const [upsells, setUpsells] = useState<any[]>([]);

    useEffect(() => {
        const fetchUpsells = async () => {
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('active', true)
                .order('created_at', { ascending: false });
            if (data) {
                setUpsells(data);
            }
        };
        fetchUpsells();
    }, []);

    // Prevent background scrolling when cart is open
    if (typeof window !== 'undefined') {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    const availableUpsells = upsells.filter(
        upsell => upsell.stock > 0 && !items.some(item => item.id === upsell.id)
    ).slice(0, 2); // Show max 2 upsells

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-md bg-[#Fdfbf7] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-white">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="text-primary" />
                                <h2 className="font-heading font-bold text-xl text-neutral-900">Your Cart</h2>
                                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                                    {items.reduce((acc, i) => acc + i.quantity, 0)} items
                                </span>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-neutral-900"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-300 mb-4">
                                        <ShoppingBag size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900 mb-2">Your cart is empty</h3>
                                    <p className="text-neutral-500 text-sm mb-6 max-w-[240px]">
                                        Looks like you haven't added anything to your cart yet.
                                    </p>
                                    <button
                                        onClick={closeCart}
                                        className="bg-neutral-900 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:scale-105 transition-transform"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => {
                                    const displayPrice = item.sale_price || item.price;

                                    return (
                                        <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-neutral-100/50 shadow-sm relative group">
                                            <div className="w-20 h-20 bg-cream/50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden relative border border-black/5">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-contain"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "/hero-product-2.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div className="pr-6">
                                                    <h4 className="font-bold text-neutral-900 text-sm leading-tight mb-1">{item.name}</h4>
                                                    <div className="text-primary font-bold text-sm">PKR {displayPrice.toLocaleString()}</div>
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center bg-neutral-50 rounded-full border border-neutral-200/60 p-0.5">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white text-neutral-500 hover:text-neutral-900 transition-colors hover:shadow-sm"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-medium text-neutral-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.stock))}
                                                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white text-neutral-500 hover:text-neutral-900 transition-colors hover:shadow-sm"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="absolute top-4 right-4 p-1.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Frequently Bought Together (Upsells) */}
                        {items.length > 0 && availableUpsells.length > 0 && (
                            <div className="px-6 py-4 bg-neutral-50 flex-shrink-0">
                                <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Frequently Bought Together</h4>
                                <div className="space-y-3">
                                    {availableUpsells.map(product => {
                                        const displayPrice = product.sale_price || product.price;
                                        return (
                                            <div key={product.id} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-neutral-200/60 shadow-sm relative overflow-hidden group">
                                                <div className="w-12 h-12 bg-cream/50 rounded-lg flex-shrink-0 flex items-center justify-center border border-black/5 p-1">
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-sm font-bold text-neutral-900 truncate">{product.name}</h5>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[13px] font-bold text-primary">PKR {displayPrice.toLocaleString()}</span>
                                                        {product.sale_price && (
                                                            <span className="text-[10px] text-muted-foreground line-through">PKR {product.price.toLocaleString()}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => addItem(product)}
                                                    className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all outline-none"
                                                    title="Add to Cart"
                                                >
                                                    <PackagePlus size={16} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="bg-white p-6 border-t border-neutral-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] pb-safe">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-neutral-500 text-sm font-medium">Subtotal</span>
                                    <span className="font-bold text-lg text-neutral-900">PKR {total.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-neutral-400 mb-6 font-medium">Shipping calculated at checkout.</p>

                                <Link
                                    to="/cart"
                                    onClick={closeCart}
                                    className="w-full flex items-center justify-center gap-3 bg-primary text-white font-bold text-[15px] py-5 rounded-2xl shadow-luxury hover:scale-[1.03] active:scale-95 transition-all shimmer-gold group"
                                >
                                    Proceed to Checkout
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
