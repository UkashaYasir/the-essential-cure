import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Activity, Clock, Star, TrendingUp, TrendingDown,
    MapPin, Wallet, CreditCard, ChevronRight, Users, Printer
} from 'lucide-react';

interface AnalyticsTabProps {
    timeRange: string;
    setTimeRange: (t: string) => void;
    totalRev: number;
    todayRev: number;
    avgOrder: number;
    conversion: number;
    trajectory: any[];
    topCities: any[];
    maxCity: number;
    codPct: number;
    codCount: number;
    xferCount: number;
    ticker: React.ReactNode;
    totalProfit: number;
    avgMargin: number;
    generateMonthlyReport: () => void;
    inventoryValuation?: { totalCogs: number, totalPotentialRev: number };
    lowStockCount?: number;
    inventoryHealth?: { name: string, daysLeft: number }[];
    clv?: number;
    customerCount?: number;
    abandonedCarts?: any[];
    onWhatsAppReminder?: (cart: any) => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
    timeRange, setTimeRange, totalRev, todayRev, avgOrder, conversion,
    trajectory, topCities, maxCity, codPct, codCount, xferCount, ticker,
    totalProfit, avgMargin, generateMonthlyReport,
    inventoryValuation = { totalCogs: 0, totalPotentialRev: 0 },
    lowStockCount = 0, inventoryHealth = [], clv = 0, customerCount = 0, abandonedCarts = [],
    onWhatsAppReminder
}) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">Business Overview</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1 opacity-60">Up-to-date Store Data</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={generateMonthlyReport}
                        className="glass-card hover:bg-white/40 text-foreground px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 border-white/40 shadow-sm"
                    >
                        <Printer size={16} className="text-primary" /> Export Report
                    </button>
                    <div className="glass-pill p-1 border-white/40 shadow-sm flex gap-1">
                        {['24H', '7D', '30D', 'ALL'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTimeRange(t)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${timeRange === t ? 'bg-primary text-primary-foreground shadow-gold' : 'text-muted-foreground hover:text-foreground hover:bg-white/20'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Sales', value: `PKR ${totalRev.toLocaleString()}`, trend: '+12.5%', icon: BarChart, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Profit', value: `PKR ${totalProfit.toLocaleString()}`, trend: `Margin: ${avgMargin}%`, icon: Activity, color: 'text-secondary', bg: 'bg-secondary/10' },
                    { label: 'Avg Customer Spend', value: `PKR ${clv.toLocaleString()}`, trend: 'Lifetime Value', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Sales Rate', value: `${conversion}%`, trend: '+0.8%', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-8 rounded-[2.5rem] border border-white/40 shadow-premium group hover:-translate-y-1 transition-all"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner`}>
                                <stat.icon size={20} strokeWidth={2.5} />
                            </div>
                            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${stat.trend.startsWith('+') || stat.trend.includes('Margin') ? 'bg-secondary/10 text-secondary' : 'bg-red-500/10 text-red-600'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-lg font-bold text-foreground tracking-tight">Sales Growth</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1 opacity-60">Money Earned</p>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 glass-pill border-white/40">
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--secondary),0.8)]" />
                            <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Live Stream</span>
                        </div>
                    </div>

                    <div className="h-72 flex items-end gap-3 px-2">
                        {trajectory.map((val, i) => {
                            const max = Math.max(...trajectory, 100);
                            const height = (val / max) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar h-full">
                                    <div className="w-full relative h-full flex items-end">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ duration: 1.2, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                            className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-2xl shadow-gold group-hover/bar:from-primary group-hover/bar:to-primary group-hover/bar:brightness-110 transition-all border-x border-t border-white/20"
                                        />
                                        {/* Value Indicator on Hover */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass-card px-2 py-1 rounded-lg text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 border-white/60">
                                            PKR {val.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-white/20 rounded-full group-hover/bar:bg-primary/40 transition-colors" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-8 rounded-[2.5rem] border border-white/40 shadow-premium">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-foreground tracking-tight">Sales by City</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1 opacity-60">Revenue by Region</p>
                            </div>
                            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                                <MapPin size={22} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="space-y-6">
                            {topCities.map(([city, rev]) => (
                                <div key={city} className="group/city">
                                    <div className="flex justify-between items-center mb-3 px-1">
                                        <span className="text-[11px] font-bold text-foreground uppercase tracking-widest group-hover/city:text-primary transition-colors">{city}</span>
                                        <span className="text-xs font-bold text-foreground font-mono">PKR {(rev as number).toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-white/30 rounded-full overflow-hidden border border-white/20">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((rev as number) / maxCity) * 100}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-primary shadow-gold group-hover/city:brightness-110 transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-obsidian p-8 rounded-[2.5rem] border border-white/10 text-white relative overflow-hidden group shadow-luxury">
                        {/* Decorative Detail */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-all duration-700" />

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/5">
                                <Wallet size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight uppercase">Payment Summary</h3>
                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] mt-1 opacity-80">How customers pay</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-10">
                            <div className="relative w-24 h-24 flex-shrink-0">
                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
                                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                    <motion.circle
                                        initial={{ strokeDasharray: "0 100" }}
                                        animate={{ strokeDasharray: `${codPct} ${100 - codPct}` }}
                                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                        cx="18" cy="18" r="15.9155" fill="none" stroke="currentColor" strokeWidth="4"
                                        className="text-primary"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-bold text-white leading-none">{codPct}%</span>
                                    <span className="text-[8px] font-bold text-white/70 uppercase tracking-widest mt-1">COD</span>
                                </div>
                            </div>
                            <div className="space-y-4 flex-1">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Collect on Delivery</span>
                                    </div>
                                    <span className="text-lg font-bold ml-4.5 text-white">{codCount} Orders</span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2.5 mb-1">
                                        <div className="w-2 h-2 bg-white/30 rounded-full" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Direct Transfer</span>
                                    </div>
                                    <span className="text-lg font-bold ml-4.5 text-white/80">{xferCount} Orders</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Additional Business Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-obsidian p-10 rounded-[3rem] border border-white/10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 text-white/5 pointer-events-none -rotate-12 translate-x-4">
                        <BarChart size={120} strokeWidth={0.5} />
                    </div>
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.3em] mb-2">Inventory Value</p>
                    <h3 className="text-2xl font-bold tracking-tight mb-8">Stock Value</h3>
                    <div className="space-y-5 relative z-10">
                        <div className="flex justify-between items-center group/item hover:translate-x-1 transition-transform">
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Total Cost of Stock</span>
                            <span className="text-sm font-bold font-mono">PKR {inventoryValuation.totalCogs.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center group/item hover:translate-x-1 transition-transform">
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Retail Value (Potential)</span>
                            <span className="text-sm font-bold font-mono text-primary">PKR {inventoryValuation.totalPotentialRev.toLocaleString()}</span>
                        </div>
                        <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Inventory Status</span>
                            <span className={`text-sm font-bold uppercase tracking-widest ${lowStockCount > 0 ? 'text-red-500' : 'text-secondary'}`}>
                                {lowStockCount > 0 ? `${lowStockCount} Low Items` : 'In Stock'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md p-10 rounded-[3rem] border border-white/60 shadow-premium relative overflow-hidden group">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-2">Inventory Health</p>
                    <h3 className="text-2xl font-bold tracking-tight mb-8">Stock Lifespan</h3>
                    <div className="space-y-4">
                        {inventoryHealth.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex justify-between items-center bg-white/30 p-3 rounded-2xl border border-white/40">
                                <span className="text-[10px] font-bold text-foreground uppercase tracking-widest truncate max-w-[120px]">{item.name}</span>
                                <span className={`text-xs font-bold ${item.daysLeft < 15 ? 'text-red-500' : 'text-emerald-600'}`}>
                                    {item.daysLeft === 999 ? 'No recent sales' : `${item.daysLeft} days left`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="md:col-span-3 glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Retrievable Lost Sales</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Abandoned or Pending Carts ({abandonedCarts.length})</p>
                    </div>
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
                        <Clock size={24} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                            <tr>
                                <th className="pb-4">Customer</th>
                                <th className="pb-4">Value</th>
                                <th className="pb-4">Abandoned</th>
                                <th className="pb-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {abandonedCarts.slice(0, 5).map((cart, i) => (
                                <tr key={i} className="group/row hover:bg-white/40 transition-colors">
                                    <td className="py-4">
                                        <p className="text-xs font-bold text-foreground">{cart.customer_name}</p>
                                        <p className="text-[9px] text-muted-foreground">{cart.customer_phone}</p>
                                    </td>
                                    <td className="py-4 text-xs font-bold text-foreground">PKR {cart.total_amount.toLocaleString()}</td>
                                    <td className="py-4 text-xs text-muted-foreground">
                                        {Math.round((Date.now() - new Date(cart.created_at).getTime()) / (1000 * 60 * 60))} hours ago
                                    </td>
                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() => onWhatsAppReminder?.(cart)}
                                            className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
                                        >
                                            Remind via WhatsApp
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {abandonedCarts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-xs text-muted-foreground italic">No retrievable abandoned carts found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {ticker}
        </div>
    );
};
