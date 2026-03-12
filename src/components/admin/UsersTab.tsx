import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, User, Mail, ShieldCheck, Trash2,
    Lock, CheckCircle2, XCircle, ChevronRight,
    Activity, Clock, AlertTriangle, UserCheck, Key, Users
} from 'lucide-react';
import { EmptyState } from './EmptyState';

interface UsersTabProps {
    users: any[];
    currentUser: any;
    updateUserRole: (id: string, role: string) => void;
    updateUserPermissions: (id: string, permissions: string[]) => void;
    deleteUser: (id: string) => void;
    auditLogs: any[];
}

const PERMISSIONS = [
    { id: 'can_edit_products', label: 'Manage Products', description: 'Modify products and pricing' },
    { id: 'can_delete_orders', label: 'Delete Orders', description: 'Ability to move orders to trash' },
    { id: 'can_manage_coupons', label: 'Manage Coupons', description: 'Create and toggle discount codes' },
    { id: 'can_see_analytics', label: 'See Sales Charts', description: 'View financial and sales analytics' },
    { id: 'can_manage_team', label: 'Manage Team', description: 'Manage other admin user roles' }
];

export const UsersTab: React.FC<UsersTabProps> = ({
    users, currentUser, updateUserRole, updateUserPermissions, deleteUser, auditLogs
}) => {
    const isSuperAdmin = currentUser?.role === 'admin';

    const getRecentActivity = (userId: string) => {
        return auditLogs.filter(log => log.admin_id === userId).slice(0, 3);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-8">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Team & Staff Management</h2>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Manage Team Roles and Access</p>
                </div>
                <div className="bg-neutral-900 text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg">
                    <UserCheck size={16} className="text-emerald-400" />
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest leading-none mb-0.5">You are logged in as</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{currentUser?.email?.split('@')[0]} ({currentUser?.role})</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-tight">Who can do what?</h4>
                                <p className="text-xs text-emerald-700/70 mt-1 leading-relaxed">
                                    Use this list to give different roles to your team. <span className="font-bold">Staff</span> can manage orders, <span className="font-bold">Managers</span> can change products, and <span className="font-bold">Admins</span> have full access.
                                    Every change you make is saved.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2 px-2">
                            <Users size={12} /> Team Member List
                        </h3>
                        <div className="space-y-4">
                            {users.length === 0 ? (
                                <div className="py-20 bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm">
                                    <EmptyState
                                        icon={Shield}
                                        title="No Personnel"
                                        description="No staff members found in the authorized list. This should not be possible."
                                    />
                                </div>
                            ) : (
                                users.map((user) => (
                                    <motion.div
                                        key={user.id}
                                        layout
                                        className="bg-white p-6 rounded-[2.5rem] border border-neutral-200 shadow-sm hover:border-neutral-900 transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-[1.25rem] bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white transition-all shadow-inner">
                                                    <User size={28} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-neutral-900 text-lg tracking-tight lowercase">{user.email}</h4>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider ${user.role === 'admin' ? 'bg-neutral-900 text-white' :
                                                            user.role === 'manager' ? 'bg-indigo-50 text-indigo-700' : 'bg-neutral-100 text-neutral-500'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest italic opacity-50">• Since {new Date(user.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {isSuperAdmin && user.id !== currentUser?.id && (
                                                <button
                                                    onClick={() => deleteUser(user.id)}
                                                    className="p-3 text-neutral-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                                    title="Revoke Access"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between px-1">
                                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Role / Power</span>
                                                </div>
                                                <div className="flex gap-2 bg-neutral-50 p-1.5 rounded-2xl border border-neutral-100">
                                                    {['staff', 'manager', 'admin'].map((r) => (
                                                        <button
                                                            key={r}
                                                            disabled={!isSuperAdmin}
                                                            onClick={() => updateUserRole(user.id, r)}
                                                            className={`flex-1 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${user.role === r
                                                                ? 'bg-white text-neutral-900 shadow-md ring-1 ring-neutral-200'
                                                                : 'text-neutral-400 hover:text-neutral-600 hover:bg-white/50'
                                                                } ${!isSuperAdmin && 'opacity-50 cursor-not-allowed'}`}
                                                        >
                                                            {r}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="px-1">
                                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Extra Actions Allowed</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {PERMISSIONS.map((p) => {
                                                        const hasPermission = user.permissions?.includes(p.id);
                                                        return (
                                                            <button
                                                                key={p.id}
                                                                disabled={!isSuperAdmin}
                                                                onClick={() => {
                                                                    const next = hasPermission
                                                                        ? user.permissions.filter((id: string) => id !== p.id)
                                                                        : [...(user.permissions || []), p.id];
                                                                    updateUserPermissions(user.id, next);
                                                                }}
                                                                className={`p-2.5 rounded-2xl border transition-all text-left flex items-center justify-between group/p ${hasPermission
                                                                    ? 'bg-neutral-900 border-neutral-900 text-white'
                                                                    : 'bg-white border-neutral-100 text-neutral-400 hover:border-neutral-300 shadow-sm'
                                                                    } ${!isSuperAdmin && 'opacity-50 cursor-not-allowed'}`}
                                                                title={p.description}
                                                            >
                                                                <span className="text-[9px] font-bold uppercase tracking-tight">{p.label}</span>
                                                                {hasPermission ? <CheckCircle2 size={10} className="text-emerald-400" /> : <Shield size={10} />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-neutral-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col justify-end">
                        <div className="absolute top-0 right-0 p-12 text-white/5 opacity-40 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <Key size={300} strokeWidth={0.5} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck size={24} className="text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-4">Safety Information</h3>
                            <p className="text-white/40 text-[11px] leading-relaxed mb-10 max-w-[240px]">
                                Your account is safe. Only people you add here can see the admin panel. All changes are tracked.
                            </p>
                            <div className="space-y-6">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Team Members</span>
                                    <span className="text-3xl font-bold font-mono tracking-tighter">{users.length.toString().padStart(2, '0')}</span>
                                </div>
                                <div className="h-px bg-white/5 w-full" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Roles Overview</span>
                                    <div className="flex gap-1.5 mt-3">
                                        {users.map((u, i) => (
                                            <div key={i} className={`w-2 h-2 rounded-full ${u.role === 'admin' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : u.role === 'manager' ? 'bg-indigo-400' : 'bg-white/20'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-[3rem] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-10 px-2">
                            <div>
                                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Recent Activity</h3>
                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">See what your team is doing</p>
                            </div>
                            <Activity size={18} className="text-neutral-300" />
                        </div>
                        <div className="space-y-8">
                            {users.map(user => {
                                const activity = getRecentActivity(user.id);
                                if (activity.length === 0) return null;
                                return (
                                    <div key={user.id + 'act'} className="relative pl-8 border-l-2 border-neutral-50 space-y-5">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-neutral-900 shadow-sm" />
                                        <div className="text-[10px] font-bold text-neutral-900 uppercase tracking-tight leading-none">{user.email.split('@')[0]}</div>
                                        <div className="space-y-4">
                                            {activity.map((log, i) => (
                                                <div key={i} className="flex items-start gap-4">
                                                    <div className="text-[8px] font-bold text-neutral-400 font-mono opacity-60 mt-0.5">
                                                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-medium text-neutral-600 leading-tight">
                                                            <span className="font-bold text-neutral-900 uppercase tracking-tight">{log.action.replace(/_/g, ' ')}</span>
                                                            <span className="mx-1.5 opacity-30">/</span>
                                                            <span className="opacity-60 lowercase font-mono">{log.resource_type}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {!users.some(u => getRecentActivity(u.id).length > 0) && (
                                <div className="py-20 text-center opacity-20">
                                    <Activity size={40} className="mx-auto mb-4" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">No Stream Data</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
