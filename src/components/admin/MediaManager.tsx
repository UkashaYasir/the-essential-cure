import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { EmptyState } from './EmptyState';

interface MediaManagerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    multiple?: boolean;
}

export const MediaManager: React.FC<MediaManagerProps> = ({ isOpen, onClose, onSelect, multiple = false }) => {
    const [images, setImages] = useState<{ name: string, url: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchMedia();
        }
    }, [isOpen]);

    const fetchMedia = async () => {
        setLoading(true);
        // Using 'product-images' bucket
        const { data, error } = await supabase.storage.from('product-images').list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' }
        });

        if (error) {
            toast.error('Failed to load media: ' + error.message);
        } else if (data) {
            const urls = await Promise.all(data.filter(f => f.name !== '.emptyFolderPlaceholder').map(async (file) => {
                const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(file.name);
                return { name: file.name, url: publicUrl };
            }));
            setImages(urls);
        }
        setLoading(false);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);

        if (uploadError) {
            toast.error(uploadError.message);
        } else {
            toast.success('Image uploaded successfully');
            fetchMedia();
        }
        setUploading(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="px-6 py-4 flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-neutral-900">
                                <ImageIcon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900 text-lg">Your Photo Library</h3>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Choose or Upload Photos</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-neutral-800 cursor-pointer transition-all">
                                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                Upload Photo
                                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                            </label>
                            <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/30">
                        {loading ? (
                            <div className="h-full flex flex-col justify-center items-center text-neutral-400 space-y-4">
                                <Loader2 size={32} className="animate-spin" />
                                <span className="text-xs font-bold uppercase tracking-wider animate-pulse">Loading Photos...</span>
                            </div>
                        ) : images.length === 0 ? (
                            <div className="h-full py-12">
                                <EmptyState
                                    icon={ImageIcon}
                                    title="No Photos Found"
                                    description="No photos found in your storage. Upload your first product image above."
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 group cursor-pointer bg-neutral-100"
                                        onClick={() => {
                                            onSelect(img.url);
                                            onClose();
                                        }}
                                    >
                                        <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/40 transition-colors flex items-center justify-center backdrop-blur-[0px] group-hover:backdrop-blur-[2px]">
                                            <div className="bg-white text-neutral-900 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-1.5">
                                                <CheckCircle2 size={12} /> Select
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
