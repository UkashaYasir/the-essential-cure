import React from 'react';
import { motion } from 'framer-motion';
import {
    Search, Download, ShieldCheck, Calendar, MapPin, Database, Archive
} from 'lucide-react';
import { EmptyState } from './EmptyState';

interface LedgerTabProps {
    masterOrders: any[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    exportCSV: (data: any[]) => void;
}

export const LedgerTab: React.FC<LedgerTabProps> = ({
    masterOrders, searchQuery, setSearchQuery, exportCSV
}) => {
    const filteredLedger = masterOrders.filter(o =>
        o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_phone.includes(searchQuery) ||
        o.id.includes(searchQuery)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
                        Order History Archive
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-lg border border-emerald-100 flex items-center gap-1">
                            <ShieldCheck size={10} /> Safe & Permanent
                        </span>
                    </h2>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Permanent records of all your orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search all orders..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-neutral-200 outline-none focus:border-neutral-900 bg-white shadow-sm transition-all"
                        />
                    </div>
                    <button onClick={() => exportCSV(filteredLedger)} className="bg-white border border-neutral-200 text-neutral-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-neutral-50 transition-all flex items-center gap-2 shadow-sm">
                        <Download size={14} /> Full Export
                    </button>
                </div>
            </div>

            <div className="bg-red-50/50 border border-red-100 p-6 rounded-3xl mb-8">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-red-900 uppercase tracking-tight leading-none mb-1">Permanent Record Information</h4>
                        <p className="text-xs text-red-700/70 mt-1 leading-relaxed max-w-2xl">
                            This list saves every order ever made. Even if you delete an order from the primary "Orders" page, it will <span className="font-bold">stay here forever</span>. This is for your records.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-neutral-50/50 border-b border-neutral-100 text-neutral-500">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Order ID / Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Customer Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Version</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 font-medium">
                            {filteredLedger.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <EmptyState
                                            icon={Archive}
                                            title="No Records Found"
                                            description="The master ledger is currently empty or no records match your search criteria."
                                        />
                                    </td>
                                </tr>
                            ) : (
                                filteredLedger.map((order, idx) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.01 }}
                                        className="group hover:bg-neutral-50 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="font-mono font-bold text-neutral-900 text-xs">#{order.id.slice(0, 8)}</div>
                                            <div className="text-[10px] text-neutral-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
                                                <Calendar size={10} /> {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-neutral-900 text-sm leading-tight underline decoration-neutral-100 decoration-2 underline-offset-4">{order.customer_name}</div>
                                            <div className="text-[10px] font-bold text-neutral-400 mt-1.5 uppercase tracking-wider flex items-center gap-1.5 opacity-60">
                                                <MapPin size={9} /> {order.customer_city}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-neutral-900 text-sm">PKR {order.total_amount?.toLocaleString()}</div>
                                            <div className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest italic">{order.payment_method}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-neutral-100 text-neutral-600 border-neutral-200'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right font-mono text-[10px] text-neutral-300">
                                            V.{new Date(order.master_vsn || order.created_at).getTime().toString().slice(-4)}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
