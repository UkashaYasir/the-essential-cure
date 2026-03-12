import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
    id: number;
    name: string;
    price: number;
    sale_price?: number;
    image_url: string;
    quantity: number;
    stock: number;
};

interface CartState {
    items: CartItem[];
    isCartOpen: boolean;
    addItem: (product: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    total: number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,
            total: 0,

            addItem: (product) => {
                const currentItems = get().items;
                const existingItem = currentItems.find(item => item.id === product.id);

                let nextItems;
                if (existingItem) {
                    if (existingItem.quantity < product.stock) {
                        nextItems = currentItems.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        );
                    } else {
                        nextItems = currentItems;
                    }
                } else {
                    nextItems = [...currentItems, { ...product, quantity: 1 }];
                }

                const nextTotal = nextItems.reduce((sum, item) => sum + (item.sale_price || item.price) * item.quantity, 0);
                set({ items: nextItems, total: nextTotal });
            },

            removeItem: (id) => {
                const nextItems = get().items.filter(item => item.id !== id);
                const nextTotal = nextItems.reduce((sum, item) => sum + (item.sale_price || item.price) * item.quantity, 0);
                set({ items: nextItems, total: nextTotal });
            },

            updateQuantity: (id, quantity) => {
                const item = get().items.find(i => i.id === id);
                if (!item) return;

                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }

                // Guard: Cap at stock
                const finalQty = Math.min(quantity, item.stock);

                const nextItems = get().items.map(i =>
                    i.id === id ? { ...i, quantity: finalQty } : i
                );
                const nextTotal = nextItems.reduce((sum, i) => sum + (i.sale_price || i.price) * i.quantity, 0);
                set({ items: nextItems, total: nextTotal });
            },

            clearCart: () => set({ items: [], total: 0 }),

            toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false })
        }),
        {
            name: 'essential-cure-cart',
            partialize: (state) => ({ items: state.items, total: state.total }), // Persist both
        }
    )
);
