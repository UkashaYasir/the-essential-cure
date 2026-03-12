import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Search, Download, Trash2, RefreshCw,
    Printer, Phone, MessageSquare, Clock, Banknote,
    Zap, CheckCircle2, AlertTriangle, Copy, Trash, MapPin
} from 'lucide-react';
import { EmptyState } from './EmptyState';
import { toast } from 'sonner';

interface OrdersTabProps {
    orders: any[];
    config: any;
    statusFilter: string;
    setStatusFilter: (s: string) => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    viewingTrash: boolean;
    setViewingTrash: (v: boolean) => void;
    selectedOrders: Set<string>;
    setSelectedOrders: (s: Set<string>) => void;
    bulkStatus: string;
    setBulkStatus: (s: string) => void;
    handleBulkUpdate: () => void;
    exportCSV: (orders?: any[]) => void;
    generateShippingLabels: (ids: string[]) => void;
    dateFrom: string;
    setDateFrom: (d: string) => void;
    dateTo: string;
    setDateTo: (d: string) => void;
    orderFilters: any;
    setDetailOrder: (o: any) => void;
    setNoteText: (t: string) => void;
    toggleOne: (id: string) => void;
    allSelected: boolean;
    toggleAll: () => void;
    filteredOrders: any[];
    STATUS_TABS: string[];
    STATUS_COLORS: Record<string, string>;
    ticker: React.ReactNode;
    moveToTrash: (id: string, notes: string) => void;
    restoreOrder: (id: string, notes: string) => void;
    setMessageOrder: (o: any) => void;
    setSelectedTemplateId: (id: number | '') => void;
    setMessagePreview: (p: string) => void;
    ordersLoading: boolean;
    ordersHasMore: boolean;
    loadMoreOrders: (reset?: boolean) => void;
    setOrderFilters: React.Dispatch<React.SetStateAction<any>>;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
    orders, config, statusFilter, setStatusFilter, searchQuery, setSearchQuery,
    viewingTrash, setViewingTrash, selectedOrders, setSelectedOrders,
    bulkStatus, setBulkStatus, handleBulkUpdate, exportCSV,
    generateShippingLabels, dateFrom, setDateFrom, dateTo, setDateTo,
    orderFilters, setDetailOrder, setNoteText, toggleOne,
    allSelected, toggleAll, filteredOrders, STATUS_TABS, STATUS_COLORS,
    ticker, moveToTrash, restoreOrder, setMessageOrder,
    setSelectedTemplateId, setMessagePreview, ordersLoading,
    ordersHasMore, loadMoreOrders, setOrderFilters
}) => {
    const [showFilters, setShowFilters] = React.useState(false);
    const pendingOrders = orders.filter(o => o.status === 'Pending Payment' || o.status === 'Processing');
    const deliveredMonth = orders.filter(o => {
        const d = new Date(o.created_at);
        const now = new Date();
        return o.status === 'Delivered' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const todayRev = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString() && o.status !== 'Cancelled' && o.status !== 'Trash').reduce((a, o) => a + (o.total_amount || 0), 0);
    const totalRev = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Trash').reduce((a, o) => a + (o.total_amount || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {ticker}

            {config && config.current_stock <= config.low_stock_threshold && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 backdrop-blur-md p-6 rounded-[2rem] border border-red-500/20 flex items-center gap-6 mb-10"
                >
                    <div className="bg-red-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ring-4 ring-red-500/10">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-[.3em] mb-1">Low Stock Alert</p>
                        <p className="text-lg font-bold text-foreground">Low Stock Level: {config.current_stock} Units Remaining</p>
                        <p className="text-xs text-muted-foreground mt-1 opacity-80">Refill required to prevent fulfillment disruption.</p>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Sales', value: `PKR ${totalRev.toLocaleString()}`, sub: `${orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Trash').length} Orders`, icon: Banknote, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: "Today's Sales", value: `PKR ${todayRev.toLocaleString()}`, sub: 'Last 24 Hours', icon: Zap, color: 'text-secondary', bg: 'bg-secondary/10' },
                    { label: 'Active Orders', value: pendingOrders.length.toString(), sub: 'Needs Action', icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Orders Delivered', value: deliveredMonth.length.toString(), sub: 'Goal Progress', icon: CheckCircle2, color: 'text-secondary', bg: 'bg-secondary/10' },
                ].map((card, idx) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card p-8 rounded-[2.5rem] border border-white/40 shadow-premium flex flex-col gap-6 group hover:-translate-y-1 transition-all"
                    >
                        <div className={`${card.bg} ${card.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner`}>
                            <card.icon size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[.2em] mb-2 opacity-60">{card.label}</p>
                            <h3 className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{card.value}</h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-40">{card.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="glass-card rounded-[3rem] border border-white/40 shadow-premium overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-widest">Orders</span>

                {/* Advanced Filters Popdown */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white/10 border-b border-white/40 overflow-hidden"
                        >
                            <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Search by City</label>
                                    <select
                                        value={orderFilters.city}
                                        onChange={e => setOrderFilters(prev => ({ ...prev, city: e.target.value }))}
                                        className="w-full bg-white/40 border border-white/40 px-5 py-3 rounded-[1.25rem] text-sm font-bold outline-none focus:bg-white/60 focus:border-primary transition-all backdrop-blur-sm"
                                    >
                                        <option value="">All Cities</option>
                                        {Array.from(new Set(orders.map(o => o.customer_city))).filter(Boolean).sort().map((c: any) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Payment Method</label>
                                    <select
                                        value={orderFilters.paymentMethod}
                                        onChange={e => setOrderFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                        className="w-full bg-white/40 border border-white/40 px-5 py-3 rounded-[1.25rem] text-sm font-bold outline-none focus:bg-white/60 focus:border-primary transition-all backdrop-blur-sm"
                                    >
                                        <option value="">All Payments</option>
                                        <option value="COD">Cash on Delivery</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Minimum Amount</label>
                                    <input
                                        type="number"
                                        value={orderFilters.minAmount || ''}
                                        onChange={e => setOrderFilters(prev => ({ ...prev, minAmount: Number(e.target.value) }))}
                                        className="w-full bg-white/40 border border-white/40 px-5 py-3 rounded-[1.25rem] text-sm font-mono font-bold outline-none focus:bg-white/60 focus:border-primary transition-all backdrop-blur-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white/10 relative z-10 border-b border-white/40 backdrop-blur-md">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search by Order ID, Name, or Phone..."
                                className="w-full pl-12 pr-6 py-3.5 bg-white/40 border border-white/40 rounded-2xl text-sm focus:bg-white/60 focus:border-primary focus:shadow-gold outline-none transition-all placeholder:text-muted-foreground/60 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-3.5 rounded-2xl border transition-all ${showFilters || orderFilters.city || orderFilters.paymentMethod || orderFilters.minAmount ? 'bg-primary text-primary-foreground border-primary shadow-gold' : 'bg-white/40 text-muted-foreground border-white/40 hover:bg-white/60 shadow-sm'}`}
                        >
                            <RefreshCw size={18} className={showFilters ? 'rotate-180 transition-transform duration-500' : 'transition-transform duration-500'} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                        {selectedOrders.size > 0 && (
                            <div className="flex items-center gap-3 bg-obsidian text-white px-4 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-luxury">
                                <span className="opacity-60">{selectedOrders.size} Selected</span>
                                <select
                                    value={bulkStatus}
                                    onChange={e => setBulkStatus(e.target.value)}
                                    className="bg-white/10 text-white text-[10px] rounded-lg px-3 py-1 outline-none border border-white/10 focus:border-primary/50"
                                >
                                    <option value="" className="bg-obsidian">Set Order Status</option>
                                    {['Processing', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} className="bg-obsidian">{s}</option>)}
                                </select>
                                <button
                                    onClick={handleBulkUpdate}
                                    disabled={!bulkStatus}
                                    className="bg-primary text-primary-foreground px-4 py-1 rounded-lg text-[10px] uppercase font-bold tracking-widest disabled:opacity-30 hover:shadow-gold transition-all"
                                >
                                    Update Selected
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => generateShippingLabels(Array.from(selectedOrders))}
                            className={`h-11 px-5 rounded-2xl bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest flex items-center gap-2.5 transition-all shadow-gold hover:shadow-premium ${selectedOrders.size === 0 ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                            disabled={selectedOrders.size === 0}
                        >
                            <Printer size={16} /> Labels
                        </button>
                        <button onClick={() => exportCSV(filteredOrders)} className="h-11 px-5 rounded-2xl bg-white/40 border border-white/40 text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-white/60 flex items-center gap-2.5 transition-all shadow-sm">
                            <Download size={16} /> Export CSV
                        </button>
                        <div className="flex items-center gap-1 bg-white/40 p-1.5 rounded-[1.25rem] border border-white/40">
                            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-transparent rounded-lg px-2 py-1 text-[10px] font-bold text-foreground outline-none uppercase tracking-tighter" />
                            <span className="text-muted-foreground/40 font-bold">/</span>
                            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-transparent rounded-lg px-2 py-1 text-[10px] font-bold text-foreground outline-none uppercase tracking-tighter" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px] flex flex-col p-2">
                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 gap-6 md:hidden mb-6 mt-4 px-2">
                        {filteredOrders.map((order, idx) => {
                            const isSelected = selectedOrders.has(order.id);
                            const trackingMatch = order.admin_notes?.match(/Tracking: (TRX-\d+)/);
                            const trackingNum = trackingMatch ? trackingMatch[1] : null;

                            return (
                                <motion.div
                                    key={`mob-${order.id}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.02 }}
                                    className={`bg-white/40 backdrop-blur-xl rounded-[2rem] shadow-premium border-2 transition-all duration-500 cursor-pointer group p-6 overflow-hidden relative ${isSelected ? 'border-primary ring-8 ring-primary/5' : 'border-white/40'}`}
                                    onClick={() => {
                                        setDetailOrder(order);
                                        setNoteText(order.admin_notes || '');
                                    }}
                                >
                                    {/* Action Reveal Overlay */}
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-gold" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-6 border-b border-white/40 pb-4">
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={(e) => { e.stopPropagation(); toggleOne(order.id); }}
                                                className="rounded-lg w-5 h-5 border-white/60 bg-white/20 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                            />
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <div className="font-mono font-bold text-foreground text-xs">#{order.id.slice(0, 8)}</div>
                                                    {trackingNum && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(trackingNum);
                                                                toast.success(`Tracking Number Copied`);
                                                            }}
                                                            className="px-2 py-1 bg-primary/10 rounded-lg text-primary transition-all flex items-center gap-1.5 border border-primary/20"
                                                        >
                                                            <Copy size={10} /> <span className="text-[8px] font-bold uppercase tracking-widest">Copy Tracking</span>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-60">Date: {new Date(order.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm border border-white/40 ${STATUS_COLORS[order.status] || 'bg-white/40 text-muted-foreground'}`}>
                                            {order.status}
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="font-bold text-foreground text-lg tracking-tight mb-1">{order.customer_name}</div>
                                            <div className="flex items-center gap-2 opacity-60">
                                                <MapPin size={12} className="text-muted-foreground" />
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{order.customer_city}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="p-3 bg-white/20 rounded-2xl border border-white/40 backdrop-blur-md">
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-40">Total</div>
                                                <div className="font-bold text-foreground text-base font-mono">PKR {order.total_amount?.toLocaleString()}</div>
                                                <div className="text-[8px] font-bold text-primary uppercase tracking-[0.2em] mt-1">{order.payment_method}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/40 flex items-center justify-between gap-4" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => { const num = order.customer_phone.replace(/[^0-9]/g, ''); const msg = `Hi ${order.customer_name},\n\nYour order *${order.id}* is now *${order.status}*!\n\nTrack: ${window.location.origin}/track?id=${order.id}`; window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank'); }} className="h-12 w-12 bg-secondary/10 text-secondary rounded-2xl border border-secondary/20 flex items-center justify-center hover:bg-secondary hover:text-white transition-all shadow-sm active:scale-95"><Phone size={18} strokeWidth={2.5} /></button>
                                            <button onClick={() => { setMessageOrder(order); setSelectedTemplateId(''); setMessagePreview(''); }} className="h-12 w-12 bg-primary/10 text-primary rounded-2xl border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"><MessageSquare size={18} strokeWidth={2.5} /></button>
                                        </div>
                                        {viewingTrash ? (
                                            <button onClick={() => restoreOrder(order.id, order.admin_notes)} className="h-12 px-6 bg-obsidian text-white rounded-2xl border border-white/10 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest hover:shadow-luxury transition-all active:scale-95"><RefreshCw size={16} /> Restore</button>
                                        ) : (
                                            <button onClick={() => moveToTrash(order.id, order.admin_notes)} className="h-12 w-12 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"><Trash size={18} strokeWidth={2.5} /></button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                        {filteredOrders.length === 0 && (
                            <div className="py-32 bg-white/20 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-premium mt-4">
                                <EmptyState
                                    icon={Package}
                                    title="No Orders Found"
                                    description="No orders found matching your search or filters."
                                />
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <table className="w-full text-left text-sm border-separate border-spacing-0 hidden md:table">
                        <thead>
                            <tr className="text-muted-foreground/60">
                                <th className="px-8 py-6 w-16 text-center border-b border-white/20">
                                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded-lg w-5 h-5 border-white/60 bg-white/20 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                                </th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/20">Order ID</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/20">Customer Name</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/20">Total Amount</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/20">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/20 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20">
                            {filteredOrders.map((order, idx) => {
                                const isSelected = selectedOrders.has(order.id);
                                return (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className={`group hover:bg-white/40 transition-all duration-300 cursor-pointer relative ${isSelected ? 'bg-primary/5' : ''}`}
                                        onClick={() => {
                                            setDetailOrder(order);
                                            setNoteText(order.admin_notes || '');
                                        }}
                                    >
                                        <td className="px-8 py-6 text-center" onClick={e => e.stopPropagation()}>
                                            <input type="checkbox" checked={isSelected} onChange={() => toggleOne(order.id)} className="rounded-lg w-5 h-5 border-white/60 bg-white/20 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3 group/id">
                                                <div className="font-mono font-bold text-foreground text-xs bg-white/40 px-3 py-1.5 rounded-xl border border-white/60">#{order.id.slice(0, 8)}</div>
                                                {(() => {
                                                    const m = order.admin_notes?.match(/Tracking: (TRX-\d+)/);
                                                    if (!m) return null;
                                                    return (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(m[1]);
                                                                toast.success("Tracking Number Copied");
                                                            }}
                                                            className="p-2 hover:bg-white rounded-xl text-muted-foreground hover:text-primary transition-all opacity-0 group-hover/id:opacity-100 shadow-sm border border-transparent hover:border-white/60"
                                                            title={`Sync: ${m[1]}`}
                                                        >
                                                            <Copy size={12} strokeWidth={2.5} />
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2 opacity-60 ml-1">Date: {new Date(order.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-foreground text-base tracking-tight mb-1">{order.customer_name}</div>
                                            <div className="flex items-center gap-2 opacity-60">
                                                <MapPin size={12} className="text-muted-foreground" />
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{order.customer_city}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-foreground text-base font-mono">PKR {order.total_amount?.toLocaleString()}</div>
                                            <div className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1 opacity-80">{order.payment_method}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm border border-white/40 whitespace-nowrap ${STATUS_COLORS[order.status] || 'bg-white/40 text-muted-foreground'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                                <button
                                                    onClick={() => {
                                                        const num = order.customer_phone.replace(/[^0-9]/g, '');
                                                        const msg = `Hi ${order.customer_name},\n\nYour order *${order.id}* is now *${order.status}*!\n\nTrack: ${window.location.origin}/track?id=${order.id}`;
                                                        window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
                                                    }}
                                                    className="h-10 w-10 bg-secondary/10 text-secondary rounded-xl border border-secondary/20 flex items-center justify-center hover:bg-secondary hover:text-white transition-all shadow-sm active:scale-95"
                                                    title="WhatsApp"
                                                >
                                                    <Phone size={16} strokeWidth={2.5} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setMessageOrder(order);
                                                        setSelectedTemplateId('');
                                                        setMessagePreview('');
                                                    }}
                                                    className="h-10 w-10 bg-primary/10 text-primary rounded-xl border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                                                    title="Message"
                                                >
                                                    <MessageSquare size={16} strokeWidth={2.5} />
                                                </button>
                                                {viewingTrash ? (
                                                    <button
                                                        onClick={() => restoreOrder(order.id, order.admin_notes)}
                                                        className="h-10 w-10 bg-obsidian text-white rounded-xl border border-white/10 flex items-center justify-center hover:bg-white hover:text-obsidian transition-all shadow-luxury active:scale-95"
                                                        title="Restore"
                                                    >
                                                        <RefreshCw size={16} strokeWidth={2.5} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => moveToTrash(order.id, order.admin_notes)}
                                                        className="h-10 w-10 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} strokeWidth={2.5} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                            {
                                filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-32 text-center">
                                            <EmptyState
                                                icon={Package}
                                                title="No Orders Found"
                                                description="No orders matched your chosen filters."
                                            />
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody >
                    </table >

                    {/* Pagination Controls */}
                    {
                        ordersHasMore && (
                            <div className="p-10 border-t border-white/20 flex justify-center">
                                <button
                                    onClick={() => loadMoreOrders(false)}
                                    disabled={ordersLoading}
                                    className="px-10 py-4 bg-obsidian text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-luxury border border-white/10 hover:shadow-premium hover:-translate-y-1 disabled:opacity-30 transition-all flex items-center justify-center min-w-[300px]"
                                >
                                    {ordersLoading ? 'Loading More Orders...' : 'Show More'}
                                </button>
                            </div>
                        )
                    }
                </div >
            </div >
        </div >
    );
};
