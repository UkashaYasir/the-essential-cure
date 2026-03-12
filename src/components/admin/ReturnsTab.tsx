import React from 'react';
import { motion } from 'framer-motion';
import {
    Clock, RefreshCw, CheckCircle2, XCircle,
    User, Phone, MapPin, Inbox
} from 'lucide-react';
import { EmptyState } from './EmptyState';

interface ReturnsTabProps {
    returns: any[];
    updateReturnStatus: (id: number, status: string) => void;
}

export const ReturnsTab: React.FC<ReturnsTabProps> = ({
    returns, updateReturnStatus
}) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Return Requests</h2>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Product Return Management</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {returns.length === 0 ? (
                    <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm">
                        <EmptyState
                            icon={Inbox}
                            title="No Returns"
                            description="There are no return requests at the moment."
                        />
                    </div>
                ) : (
                    returns.map((r) => (
                        <div key={r.id} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-neutral-900 transition-all flex flex-col hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center">
                                        <RefreshCw size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 tracking-tight text-sm uppercase">Order #{r.order_id.slice(0, 8)}</h3>
                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Requested {new Date(r.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${r.status === 'Pending' ? 'bg-amber-50 text-amber-600' : r.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {r.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <User size={14} className="text-neutral-400" />
                                    <span className="text-xs font-bold text-neutral-900 truncate">{r.customer_name}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <Phone size={14} className="text-neutral-400" />
                                    <span className="text-xs font-bold text-neutral-900">{r.customer_phone}</span>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Reason for Return</h4>
                                    <p className="text-sm font-bold text-neutral-900 leading-snug">{r.reason}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Additional Details</h4>
                                    <p className="text-xs text-neutral-500 font-medium leading-relaxed italic">"{r.details}"</p>
                                </div>
                            </div>

                            {r.status === 'Pending' && (
                                <div className="flex gap-2 mt-8 pt-6 border-t border-neutral-100">
                                    <button
                                        onClick={() => updateReturnStatus(r.id, 'Approved')}
                                        className="flex-1 bg-emerald-500 text-white py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={12} /> Approve
                                    </button>
                                    <button
                                        onClick={() => updateReturnStatus(r.id, 'Rejected')}
                                        className="flex-1 bg-red-500 text-white py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-red-600 transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={12} /> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
