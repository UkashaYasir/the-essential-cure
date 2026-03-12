import React from 'react';
import { motion } from 'framer-motion';
import {
    MessageSquare, Plus, Edit2, Trash2,
    Zap, CheckCircle2, Clock, Inbox
} from 'lucide-react';
import { EmptyState } from './EmptyState';

interface MessagesTabProps {
    templates: any[];
    showAddTemplate: boolean;
    setShowAddTemplate: (s: boolean) => void;
    newTemplate: any;
    setNewTemplate: (t: any) => void;
    createTemplate: () => void;
    editingTemplate: any;
    setEditingTemplate: (t: any) => void;
    updateTemplate: () => void;
    deleteTemplate: (id: number) => void;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
    templates, showAddTemplate, setShowAddTemplate, newTemplate,
    setNewTemplate, createTemplate, editingTemplate, setEditingTemplate,
    updateTemplate, deleteTemplate
}) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Message Templates</h2>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Saved Messages for Customers</p>
                </div>
                <button
                    onClick={() => setShowAddTemplate(true)}
                    className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-lg"
                >
                    <Plus size={16} /> New Template
                </button>
            </div>

            {(showAddTemplate || editingTemplate) && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-2xl space-y-6 max-w-3xl"
                >
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">Template Name</label>
                            <input
                                type="text"
                                value={editingTemplate ? editingTemplate.name : newTemplate.name}
                                onChange={e => editingTemplate ? setEditingTemplate({ ...editingTemplate, name: e.target.value }) : setNewTemplate({ ...newTemplate, name: e.target.value })}
                                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl text-sm font-bold outline-none focus:border-neutral-900 transition-all"
                                placeholder="Order Confirmation"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">Category</label>
                            <select
                                value={editingTemplate ? editingTemplate.category : newTemplate.category}
                                onChange={e => editingTemplate ? setEditingTemplate({ ...editingTemplate, category: e.target.value }) : setNewTemplate({ ...newTemplate, category: e.target.value })}
                                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl text-sm font-bold outline-none focus:border-neutral-900 transition-all"
                            >
                                <option>Order</option><option>Payment</option><option>Shipping</option><option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Message Text</label>
                            <span className="text-[9px] font-bold text-neutral-300">Automatic Details: {'{name}'}, {'{id}'}, {'{amount}'}, {'{status}'}</span>
                        </div>
                        <textarea
                            rows={8}
                            value={editingTemplate ? editingTemplate.template_text : newTemplate.template_text}
                            onChange={e => editingTemplate ? setEditingTemplate({ ...editingTemplate, template_text: e.target.value }) : setNewTemplate({ ...newTemplate, template_text: e.target.value })}
                            className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-2xl text-sm font-medium outline-none focus:border-neutral-900 transition-all resize-none leading-relaxed"
                            placeholder="Hi {name}, your order {id} totaling PKR {amount} is now {status}!"
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        {editingTemplate ? (
                            <button onClick={updateTemplate} className="flex-1 bg-neutral-900 text-white py-3.5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-lg">Save Changes</button>
                        ) : (
                            <button onClick={createTemplate} className="flex-1 bg-neutral-900 text-white py-3.5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-lg">Create Template</button>
                        )}
                        <button onClick={() => { setShowAddTemplate(false); setEditingTemplate(null); }} className="px-8 border border-neutral-200 text-neutral-400 rounded-xl text-xs font-bold hover:bg-neutral-50 transition-all">Cancel</button>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.length === 0 ? (
                    <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm">
                        <EmptyState
                            icon={Inbox}
                            title="No Templates"
                            description="You haven't created any canned responses yet. Save time by creating message templates."
                        />
                    </div>
                ) : (
                    templates.map((t) => (
                        <div key={t.id} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm relative overflow-hidden group hover:border-neutral-900 transition-all flex flex-col hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center">
                                        <MessageSquare size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 tracking-tight text-sm uppercase">{t.name}</h3>
                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{t.category}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingTemplate(t)} className="p-2 rounded-xl bg-neutral-50 text-neutral-400 hover:text-neutral-900 transition-all shadow-sm"><Edit2 size={14} /></button>
                                    <button onClick={() => deleteTemplate(t.id)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-50 transition-all shadow-sm"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="bg-neutral-50 p-4 rounded-2xl flex-1 border border-neutral-100">
                                <p className="text-xs text-neutral-600 font-medium leading-relaxed italic line-clamp-4">"{t.template_text}"</p>
                            </div>
                            <div className="mt-4 flex items-center gap-4 text-[9px] font-bold text-neutral-300 uppercase tracking-widest">
                                <span>Created on: {new Date(t.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
