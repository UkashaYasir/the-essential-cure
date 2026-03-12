import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCartStore } from './cartStore';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Cart Store', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart();
        localStorageMock.clear();
    });

    it('should add an item to the cart', () => {
        const product = { id: 1, name: 'Natural Hair Oil', price: 1500, image_url: 'oil.jpg', stock: 10 };
        useCartStore.getState().addItem(product);

        const { items, total } = useCartStore.getState();
        expect(items.length).toBe(1);
        expect(items[0].id).toBe(1);
        expect(items[0].quantity).toBe(1);
        expect(total).toBe(1500);
    });

    it('should increment quantity when adding the same item', () => {
        const product = { id: 1, name: 'Natural Hair Oil', price: 1500, stock: 10 };
        useCartStore.getState().addItem(product);
        useCartStore.getState().addItem(product);

        const { items } = useCartStore.getState();
        expect(items[0].quantity).toBe(2);
    });

    it('should remove items correctly', () => {
        const product = { id: 1, name: 'Oil', price: 1000, stock: 10 };
        useCartStore.getState().addItem(product);
        useCartStore.getState().removeItem(1);

        expect(useCartStore.getState().items.length).toBe(0);
    });

    it('should update quantity via updateQuantity method', () => {
        const product = { id: 1, name: 'Oil', price: 1000, stock: 10 };
        useCartStore.getState().addItem(product);
        useCartStore.getState().updateQuantity(1, 5);

        expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    it('should respect stock limits when updating quantity', () => {
        const product = { id: 1, name: 'Oil', price: 1000, stock: 3 };
        useCartStore.getState().addItem(product);
        useCartStore.getState().updateQuantity(1, 10); // Should be capped at 3

        expect(useCartStore.getState().items[0].quantity).toBe(3);
    });

    it('should calculate total correctly with multiple items', () => {
        useCartStore.getState().addItem({ id: 1, name: 'A', price: 100, stock: 10 });
        useCartStore.getState().addItem({ id: 2, name: 'B', price: 200, stock: 10 });
        useCartStore.getState().updateQuantity(1, 2);

        expect(useCartStore.getState().total).toBe(400); // (100*2) + 200
    });
});
