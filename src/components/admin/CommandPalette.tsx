import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Users, Layers, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { EmptyState } from './EmptyState';

interface CommandPaletteProps {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
    setActiveTab: (t: string) => void;
    setSearchQuery: (q: string) => void;
    setDetailOrder: (o: any) => void;
    setEditingProduct: (p: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
    isOpen, setIsOpen, setActiveTab, setSearchQuery, setDetailOrder, setEditingProduct
}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ type: string; label: string; subLabel: string; payload: any }[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, setIsOpen]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const searchDB = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            const term = query.trim();

            const resultsData: any[] = [];

            // Search Orders
            if (term.toUpperCase().startsWith('ORD')) {
                const { data } = await supabase.from('orders').select('*').ilike('id', `%${term}%`).limit(5);
                if (data) {
                    data.forEach(o => resultsData.push({ type: 'order', label: `Order ${o.id.slice(0, 8)}`, subLabel: `${o.customer_name} • ${o.status}`, payload: o }));
                }
            } else {
                const { data: ord_phone } = await supabase.from('orders').select('*').ilike('customer_phone', `%${term}%`).limit(3);
                const { data: ord_name } = await supabase.from('orders').select('*').ilike('customer_name', `%${term}%`).limit(3);

                const combinedOrders = new Map();
                [...(ord_phone || []), ...(ord_name || [])].forEach(o => combinedOrders.set(o.id, o));
                Array.from(combinedOrders.values()).slice(0, 5).forEach(o =>
                    resultsData.push({ type: 'order', label: `Order ${o.id.slice(0, 8)}`, subLabel: `${o.customer_name} • ${o.status}`, payload: o })
                );

                // Search Products
                const { data: prods } = await supabase.from('products').select('*').ilike('name', `%${term}%`).limit(3);
                if (prods) {
                    prods.forEach(p => resultsData.push({ type: 'product', label: p.name, subLabel: `Manage Product`, payload: p }));
                }
            }

            setResults(resultsData);
            setSelectedIndex(0);
            setLoading(false);
        };

        const timer = setTimeout(searchDB, 400);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        const handleNavigation = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === 'Enter' && results.length > 0) {
                e.preventDefault();
                executeAction(results[selectedIndex]);
            }
        };
        window.addEventListener('keydown', handleNavigation);
        return () => window.removeEventListener('keydown', handleNavigation);
    }, [isOpen, results, selectedIndex]);

    const executeAction = (result: any) => {
        setIsOpen(false);
        if (result.type === 'order') {
            setActiveTab('orders');
            setSearchQuery(result.payload.id);
            setDetailOrder(result.payload);
        } else if (result.type === 'product') {
            setActiveTab('products');
            setEditingProduct(result.payload);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center px-4 py-3 border-b border-neutral-100">
                    <Search className="text-neutral-400" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search orders, customers, or products..."
                        className="flex-1 bg-transparent border-none outline-none px-4 text-base font-medium text-neutral-900 placeholder:text-neutral-400"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    {loading && <Loader2 className="animate-spin text-neutral-400" size={18} />}
                    <div className="ml-3 flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-neutral-100 rounded text-[10px] font-mono text-neutral-500 font-bold uppercase">esc</kbd>
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {results.length === 0 && query.length >= 2 && !loading && (
                        <div className="py-12 bg-neutral-50/50 rounded-2xl m-2 border border-neutral-100">
                            <EmptyState
                                icon={XCircle}
                                title="No Results Found"
                                description={`We couldn't find any orders, products, or customers matching "${query}".`}
                            />
                        </div>
                    )}
                    {results.length === 0 && query.length < 2 && (
                        <div className="p-8 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest">
                            Type at least 2 characters to search
                        </div>
                    )}

                    {results.map((r, i) => (
                        <button
                            key={i}
                            className={`w-full text-left rounded-xl p-3 flex items-center justify-between group transition-colors ${i === selectedIndex ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-50'}`}
                            onClick={() => executeAction(r)}
                            onMouseEnter={() => setSelectedIndex(i)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === selectedIndex ? 'bg-white/10' : 'bg-neutral-100/80 text-neutral-500'}`}>
                                    {r.type === 'order' ? <Package size={16} /> : <Layers size={16} />}
                                </div>
                                <div>
                                    <div className={`font-bold text-sm ${i === selectedIndex ? 'text-white' : 'text-neutral-900'}`}>{r.label}</div>
                                    <div className={`text-[10px] uppercase tracking-wider font-bold mt-0.5 ${i === selectedIndex ? 'text-white/60' : 'text-neutral-400'}`}>{r.subLabel}</div>
                                </div>
                            </div>
                            <ArrowRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${i === selectedIndex ? 'text-white/50 opacity-100' : 'text-neutral-400'}`} />
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
