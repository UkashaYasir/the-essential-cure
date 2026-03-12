import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, CheckCircle2, User, Search, Download, Sparkles } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface LeadsTabProps {
    leads: any[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
}

export const LeadsTab: React.FC<LeadsTabProps> = ({ leads, searchQuery, setSearchQuery }) => {
    const filteredLeads = leads.filter(l =>
        l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.recommended_product?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const exportLeads = () => {
        const csv = [
            ['Name', 'Email', 'Product', 'Date'],
            ...filteredLeads.map(l => [l.name, l.email, l.recommended_product, new Date(l.created_at).toLocaleDateString()])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `quiz_leads_${new Date().toISOString().slice(0, 10)}.csv`);
        a.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Quiz Leads</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Potential customers from Hair Quiz</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white/50 border border-white/40 outline-none focus:border-primary transition-all"
                        />
                    </div>
                    <button onClick={exportLeads} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-gold transition-all flex items-center gap-2">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLeads.length === 0 ? (
                    <div className="col-span-full py-20 bg-white/30 rounded-[3rem] border border-dashed border-white/40 flex items-center justify-center">
                        <EmptyState
                            icon={Mail}
                            title="No Leads Found"
                            description="Wait for customers to complete the hair quiz or adjust your search."
                        />
                    </div>
                ) : (
                    filteredLeads.map((lead, idx) => (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card p-6 rounded-[2rem] border border-white/40 relative overflow-hidden group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <User size={20} />
                                </div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                    <Calendar size={10} /> {new Date(lead.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-foreground mb-1">{lead.name || 'Anonymous'}</h3>
                            <div className="flex items-center gap-2 text-primary font-medium text-xs mb-6 lowercase">
                                <Mail size={12} /> {lead.email}
                            </div>

                            <div className="bg-white/40 p-4 rounded-2xl border border-white/60 space-y-3">
                                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Recommendation</div>
                                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                    <Sparkles size={14} className="text-secondary" />
                                    {lead.recommended_product}
                                </div>
                            </div>

                            <div className="absolute -bottom-2 -right-2 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                <Mail size={80} />
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};
