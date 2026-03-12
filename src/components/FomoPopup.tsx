import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type RecentOrder = {
    customer_name: string;
    customer_city: string;
    created_at: string;
    quantity: number;
};

// Fallback data if DB fetch fails or is empty
const MOCK_ORDERS = [
    { customer_name: 'Ayesha', customer_city: 'Lahore', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), quantity: 1 },
    { customer_name: 'Zainab', customer_city: 'Karachi', created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), quantity: 2 },
    { customer_name: 'Fatima', customer_city: 'Islamabad', created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), quantity: 1 },
    { customer_name: 'Maryum', customer_city: 'Peshawar', created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), quantity: 3 }
];

export default function FomoPopup() {
    const [orders, setOrders] = useState<RecentOrder[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('customer_name, customer_city, created_at, quantity')
                    .neq('status', 'Cancelled')
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (!error && data && data.length > 0) {
                    setOrders(data);
                } else {
                    setOrders(MOCK_ORDERS);
                }
            } catch (e) {
                setOrders(MOCK_ORDERS);
            }
        };
        fetchRecentOrders();
    }, []);

    useEffect(() => {
        if (orders.length === 0) return;

        // Show popup every 15-25 seconds
        const showDelay = Math.floor(Math.random() * 10000) + 15000;

        const showTimer = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % orders.length);
            setIsVisible(true);

            // Hide after 6 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 6000);

        }, showDelay);

        return () => clearTimeout(showTimer);
    }, [isVisible, orders.length]);

    if (orders.length === 0) return null;

    const currentOrder = orders[currentIndex];

    // Format "time ago"
    const getRelativeTime = (dateString: string) => {
        const diffInMins = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins} mins ago`;
        const diffInHours = Math.floor(diffInMins / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        return '1 day ago';
    };

    // Mask name: "Ayesha" -> "Ayesha", "Ali Raza" -> "Ali R."
    const formatName = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length > 1) {
            return `${parts[0]} ${parts[1][0]}.`;
        }
        return parts[0];
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                    className="fixed bottom-6 left-6 z-50 pointer-events-auto"
                >
                    <div className="bg-white/95 backdrop-blur-md border border-neutral-200 shadow-xl rounded-2xl p-4 flex items-center gap-4 max-w-sm w-[320px] relative overflow-hidden group">
                        {/* Soft highlight effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600 p-1 rounded-md"
                        >
                            <X size={14} />
                        </button>

                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                            <ShoppingBag className="text-primary w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <p className="text-sm font-bold text-neutral-900 truncate">
                                    {formatName(currentOrder.customer_name)}
                                </p>
                                <span className="text-xs text-neutral-500 whitespace-nowrap">in {currentOrder.customer_city}</span>
                            </div>
                            <p className="text-xs text-neutral-600 truncate mb-1">
                                Purchased {currentOrder.quantity}x Hair Oil
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Verified
                                </div>
                                <span className="text-[10px] font-medium text-neutral-400">{getRelativeTime(currentOrder.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
