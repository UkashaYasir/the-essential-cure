import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center"
        >
            <div className="w-16 h-16 bg-neutral-100 rounded-[2rem] flex items-center justify-center text-neutral-400 mb-6">
                <Icon size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 tracking-tight mb-2 uppercase">{title}</h3>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">
                {description}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-8 bg-neutral-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-lg"
                >
                    {action.label}
                </button>
            )}
        </motion.div>
    );
};
