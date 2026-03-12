import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Search, Download, Star, X,
    ArrowUpRight, MapPin, Phone,
    Package, ExternalLink, Banknote
} from 'lucide-react';
import { EmptyState } from './EmptyState';

interface CustomersTabProps {
    customers: any[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    exportCSV: (data: any[]) => void;
    sendWhatsAppBroadcast?: (phones: string[], message: string) => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({
    customers, searchQuery, setSearchQuery, exportCSV, sendWhatsAppBroadcast
}) => {
    const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
    const [selectedForBroadcast, setSelectedForBroadcast] = useState<Set<string>>(new Set());
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [broadcastMessage, setBroadcastMessage] = useState('');

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Customer Data</p>
                    </div>
                    <h2 className="text-4xl font-bold text-foreground tracking-tight">Customer List</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="relative group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search Customers..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full sm:w-80 pl-11 pr-6 py-4 rounded-2xl text-[11px] font-bold bg-white/40 border border-white/40 outline-none focus:bg-white/60 focus:border-primary transition-all backdrop-blur-sm shadow-inner uppercase tracking-wider placeholder:text-muted-foreground/40"
                        />
                    </div>
                    <button
                        onClick={() => exportCSV(filteredCustomers)}
                        className="h-14 px-8 bg-white/40 backdrop-blur-md border border-white/40 text-foreground rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:border-primary transition-all flex items-center justify-center gap-3 shadow-premium active:scale-95"
                    >
                        <Download size={18} />
                        <span>Export List</span>
                    </button>
                    {selectedForBroadcast.size > 0 && (
                        <button
                            onClick={() => setShowBroadcastModal(true)}
                            className="h-14 px-8 bg-primary text-primary-foreground rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:shadow-gold transition-all flex items-center justify-center gap-3 shadow-premium animate-in zoom-in"
                        >
                            <Phone size={18} />
                            <span>Broadcast ({selectedForBroadcast.size})</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredCustomers.length === 0 ? (
                    <div className="col-span-full py-40 glass-card rounded-[4rem] border border-white/40 shadow-premium flex items-center justify-center">
                        <EmptyState
                            icon={Users}
                            title="No Customers Found"
                            description="No customers matched your search."
                        />
                    </div>
                ) : (
                    filteredCustomers.map((c, i) => (
                        <motion.div
                            key={c.phone}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium group hover:border-primary/40 transition-all flex flex-col cursor-pointer hover:-translate-y-2 hover:shadow-luxury relative overflow-hidden"
                            onClick={() => setSelectedCustomer(c)}
                        >
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const next = new Set(selectedForBroadcast);
                                    if (next.has(c.phone)) next.delete(c.phone);
                                    else next.add(c.phone);
                                    setSelectedForBroadcast(next);
                                }}
                                className={`absolute top-6 left-6 w-6 h-6 rounded-full border-2 z-20 transition-all flex items-center justify-center ${selectedForBroadcast.has(c.phone) ? 'bg-primary border-primary' : 'bg-white/20 border-white/40'}`}
                            >
                                {selectedForBroadcast.has(c.phone) && <Search size={12} className="text-white" />}
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-colors group-hover:bg-primary/10" />

                            <div className="flex items-start justify-between mb-8 relative z-10 pl-8">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-obsidian text-white flex items-center justify-center font-bold text-2xl shadow-premium border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                    {c.name.charAt(0)}
                                </div>
                                {c.totalSpend > 5000 && (
                                    <span className="bg-primary/10 text-primary text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] flex items-center gap-2 border border-primary/20">
                                        <Star size={10} fill="currentColor" /> VIP Customer
                                    </span>
                                )}
                            </div>

                            <div className="mb-8 relative z-10">
                                <h3 className="text-xl font-bold text-foreground truncate uppercase tracking-tight group-hover:text-primary transition-colors duration-300">{c.name}</h3>
                                <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <MapPin size={12} className="text-secondary" /> {c.city}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                                <div className="space-y-2 p-4 bg-white/20 rounded-2xl border border-white/40 shadow-inner">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block opacity-50">Total Spent</span>
                                    <p className="text-sm font-bold text-foreground font-mono">PKR {c.totalSpend.toLocaleString()}</p>
                                </div>
                                <div className="space-y-2 p-4 bg-white/20 rounded-2xl border border-white/40 shadow-inner">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block opacity-50">Orders Count</span>
                                    <p className="text-sm font-bold text-foreground font-mono">{c.orders.length} Orders</p>
                                </div>
                            </div>

                            <div className="mt-auto pt-8 border-t border-white/20 flex items-center justify-between relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Customer Status</span>
                                    <span className="text-[11px] font-bold text-secondary uppercase tracking-widest mt-0.5">Healthy</span>
                                </div>
                                <div className="w-12 h-12 bg-white/40 border border-white/40 text-muted-foreground rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
                                    <ArrowUpRight size={20} strokeWidth={2.5} />
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {selectedCustomer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-obsidian/40 backdrop-blur-2xl">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCustomer(null)}
                            className="absolute inset-0"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="glass-card w-full max-w-6xl max-h-[90vh] rounded-[4rem] shadow-luxury relative overflow-hidden flex flex-col border border-white/40"
                        >
                            <div className="p-12 border-b border-white/10 bg-white/20 backdrop-blur-md flex items-start justify-between">
                                <div className="flex items-center gap-10">
                                    <div className="w-28 h-28 rounded-[2.5rem] bg-obsidian text-white flex items-center justify-center text-4xl font-bold shadow-luxury border-2 border-white/10">
                                        {selectedCustomer.name.charAt(0)}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-5">
                                            <h2 className="text-5xl font-bold text-foreground uppercase tracking-tighter">{selectedCustomer.name}</h2>
                                            {selectedCustomer.totalSpend > 5000 && <span className="px-5 py-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full uppercase tracking-[0.3em] shadow-gold">VIP Member</span>}
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <MapPin size={18} className="text-secondary" />
                                                <span className="text-xs font-bold uppercase tracking-[0.2em]">{selectedCustomer.city}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                                                <Phone size={18} className="text-secondary group-hover:rotate-12 transition-transform" />
                                                <span className="text-sm font-bold font-mono tracking-tight">{selectedCustomer.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="p-5 bg-white/40 text-muted-foreground rounded-[2rem] hover:bg-obsidian hover:text-white transition-all shadow-premium"
                                >
                                    <X size={28} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                    <div className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Banknote size={80} />
                                        </div>
                                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-4">Total Amount Spent</p>
                                        <h4 className="text-3xl font-bold text-foreground font-mono tracking-tight">PKR {selectedCustomer.totalSpend.toLocaleString()}</h4>
                                        <div className="mt-6 flex items-center gap-3">
                                            <div className="w-full bg-white/40 h-2 rounded-full overflow-hidden shadow-inner">
                                                <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="bg-gradient-to-r from-secondary to-primary h-full" />
                                            </div>
                                            <span className="text-[10px] font-bold text-primary tracking-widest">LOYAL</span>
                                        </div>
                                    </div>
                                    <div className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium">
                                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-4">Total Orders</p>
                                        <h4 className="text-3xl font-bold text-foreground tracking-tight">{selectedCustomer.orders.length} <span className="text-sm opacity-40 uppercase tracking-[0.2em] ml-2">Orders</span></h4>
                                        <div className="mt-6 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Most Recent Order: {new Date(selectedCustomer.orders[0]?.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium group">
                                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-4">Average Order Value</p>
                                        <h4 className="text-3xl font-bold text-foreground font-mono tracking-tight">PKR {Math.round(selectedCustomer.totalSpend / selectedCustomer.orders.length).toLocaleString()}</h4>
                                        <div className="mt-6 flex items-center gap-2 text-secondary">
                                            <ArrowUpRight size={14} strokeWidth={2.5} />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Valuable Customer</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex items-center justify-between px-4">
                                        <h3 className="text-xs font-bold text-foreground uppercase tracking-[0.4em] flex items-center gap-4">
                                            <Package size={20} className="text-primary" /> Order History
                                        </h3>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] bg-white/40 px-5 py-2 rounded-full border border-white/40">{selectedCustomer.orders.length} Successful Orders</span>
                                    </div>

                                    <div className="glass-card border border-white/40 rounded-[3.5rem] overflow-hidden shadow-luxury">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="bg-white/20 border-b border-white/10 text-muted-foreground">
                                                    <th className="px-10 py-8 font-bold uppercase tracking-[0.3em]">Order ID / Date</th>
                                                    <th className="px-10 py-8 font-bold uppercase tracking-[0.3em]">Order Status</th>
                                                    <th className="px-10 py-8 font-bold uppercase tracking-[0.3em]">Total Price</th>
                                                    <th className="px-10 py-8 font-bold uppercase tracking-[0.3em] text-right">View</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {selectedCustomer.orders.map((order: any) => (
                                                    <tr key={order.id} className="group hover:bg-white/40 transition-all duration-300">
                                                        <td className="px-10 py-8">
                                                            <div className="font-mono font-bold text-foreground uppercase tracking-tight text-sm">#{order.id.slice(0, 8)}</div>
                                                            <div className="text-[10px] text-muted-foreground font-bold mt-2 uppercase tracking-[0.2em]">{new Date(order.created_at).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="px-10 py-8">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-2.5 h-2.5 rounded-full ${order.status === 'Delivered' ? 'bg-secondary animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]' :
                                                                    order.status === 'Cancelled' ? 'bg-red-500' : 'bg-primary'
                                                                    }`} />
                                                                <span className="font-bold text-foreground uppercase tracking-[0.1em] text-[11px]">{order.status}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-8">
                                                            <span className="font-mono font-bold text-foreground tracking-tight text-sm">PKR {order.total_amount.toLocaleString()}</span>
                                                        </td>
                                                        <td className="px-10 py-8 text-right">
                                                            <div className="w-12 h-12 bg-white/40 border border-white/40 text-muted-foreground rounded-2xl hover:bg-obsidian hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm group-hover:scale-110">
                                                                <ExternalLink size={18} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Broadcast Modal */}
            <AnimatePresence>
                {showBroadcastModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-obsidian/40 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card w-full max-w-xl rounded-[3rem] p-12 border border-white/40 shadow-luxury"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-bold text-foreground">WhatsApp Broadcast</h2>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">Sending to {selectedForBroadcast.size} Recipients</p>
                                </div>
                                <button onClick={() => setShowBroadcastModal(false)} className="p-4 bg-muted/20 rounded-2xl hover:bg-muted/40 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Message</label>
                                    <textarea
                                        rows={6}
                                        value={broadcastMessage}
                                        onChange={e => setBroadcastMessage(e.target.value)}
                                        className="w-full bg-white/40 border border-white/40 rounded-3xl p-6 text-sm font-medium outline-none focus:border-primary transition-all resize-none leading-relaxed"
                                        placeholder="Type your message here..."
                                    />
                                </div>

                                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20">
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] leading-relaxed">
                                        Note: This helper opens WhatsApp with the message for the recipients. For bulk automated sending, consider an official Meta API integration.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        if (sendWhatsAppBroadcast) {
                                            sendWhatsAppBroadcast(Array.from(selectedForBroadcast), broadcastMessage);
                                            setShowBroadcastModal(false);
                                            setSelectedForBroadcast(new Set());
                                        }
                                    }}
                                    className="w-full bg-foreground text-background font-bold py-5 rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-premium"
                                >
                                    <Phone size={20} />
                                    Launch Broadcast
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

