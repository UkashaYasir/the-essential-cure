import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, CheckCircle, Quote, Plus, XCircle, Upload, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { compressImage, uploadImage } from '@/lib/storageUtils';

type Review = {
    id: number;
    name: string;
    location: string;
    review: string;
    rating: number;
    tag: string;
    verified: boolean;
    image_url?: string;
};

const MOCK_REVIEWS: Review[] = [
    {
        id: 1,
        name: "Fatima Noor",
        location: "Lahore",
        review: "This oil is a lifesaver! My hair fall has reduced by 80% in just 3 weeks.",
        rating: 5,
        tag: "Verified Buyer",
        verified: true
    },
    {
        id: 2,
        name: "Ayesha S.",
        location: "Karachi",
        review: "Absolutely love the smell and texture. It doesn't feel heavy and washes out nicely.",
        rating: 5,
        tag: "Verified Buyer",
        verified: true
    },
    {
        id: 3,
        name: "Zainab Ali",
        location: "Islamabad",
        review: "Saw baby hairs growing around my hairline after 1 month of consistent use. 10/10.",
        rating: 5,
        tag: "Verified Buyer",
        verified: true
    }
];

export default function ReviewCarousel() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Review Modal State
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({
        name: '',
        location: '',
        review: '',
        rating: 5,
        image_url: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let finalImageUrl = newReview.image_url;

            if (selectedFile) {
                setUploading(true);
                const compressed = await compressImage(selectedFile);
                finalImageUrl = await uploadImage(compressed, 'product-media', 'reviews');
                setUploading(false);
            }

            const { error } = await supabase.from('customer_reviews').insert([{
                name: newReview.name,
                location: newReview.location,
                review: newReview.review,
                rating: newReview.rating,
                image_url: finalImageUrl,
                active: false, // Must be approved by admin
                verified: false,
                tag: 'Customer'
            }]);

            if (error) throw error;

            toast.success('Review submitted successfully! It will appear after approval.');
            setShowModal(false);
            setNewReview({ name: '', location: '', review: '', rating: 5, image_url: '' });
            setSelectedFile(null);
        } catch (err: any) {
            toast.error(err.message || 'Failed to submit review. Try again.');
        } finally {
            setSubmitting(false);
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data, error } = await supabase
                    .from('customer_reviews')
                    .select('*')
                    .eq('active', true)
                    .order('created_at', { ascending: false });

                if (!error && data && data.length > 0) {
                    setReviews(data);
                } else {
                    setReviews(MOCK_REVIEWS);
                }
            } catch (err) {
                setReviews(MOCK_REVIEWS);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) return null;
    if (reviews.length === 0) return null;

    return (
        <>
            <section className="py-20 bg-[#Fdfbf7] overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="text-center mb-12 relative flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-display text-neutral-900 mb-4">
                            Loved by Thousands
                        </h2>
                        <p className="text-neutral-600 font-body max-w-2xl mx-auto mb-6">
                            Real results from our verified customers across Pakistan.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-neutral-900 text-white px-6 py-3 rounded-xl font-bold font-body hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <MessageSquare size={18} /> Write a Review
                        </button>
                    </div>

                    {/* Auto-scrolling carousel track */}
                    <div className="relative w-full flex overflow-x-hidden group pb-8">
                        <motion.div
                            className="flex gap-6 whitespace-nowrap min-w-max"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ ease: "linear", duration: reviews.length * 5, repeat: Infinity }}
                        >
                            {/* Duplicate the reviews array to create an infinite scroll illusion */}
                            {[...reviews, ...reviews, ...reviews].map((review, idx) => (
                                <div
                                    key={`${review.id}-${idx}`}
                                    className="w-[320px] md:w-[380px] bg-white border border-neutral-100/50 p-6 md:p-8 rounded-3xl shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 whitespace-normal flex flex-col"
                                >
                                    <div className="flex gap-1 text-amber-500 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-amber-500" : "text-neutral-200"} strokeWidth={1.5} />
                                        ))}
                                    </div>
                                    <Quote size={24} className="text-primary/10 mb-2 rotate-180" />
                                    <p className="text-neutral-700 font-body leading-relaxed text-[15px] mb-4 flex-1 line-clamp-4">
                                        "{review.review}"
                                    </p>

                                    {review.image_url && (
                                        <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 flex-shrink-0 bg-neutral-50 border border-neutral-100/50">
                                            <img src={review.image_url} alt="Review attachment" className="w-full h-full object-cover" loading="lazy" />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-neutral-50">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary shrink-0">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-neutral-900 text-sm truncate">{review.name}</h4>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                {review.verified && <CheckCircle size={12} className="text-emerald-500 shrink-0" />}
                                                <span className="text-xs text-neutral-500 truncate">{review.tag || (review.verified ? 'Verified Buyer' : 'Customer')} {review.location ? `• ${review.location}` : ''}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- Leave a Review Modal --- */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto overflow-x-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors">
                                <XCircle size={24} />
                            </button>

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-display font-bold text-neutral-900">Share Your Journey</h3>
                                <p className="text-sm text-neutral-500 font-body mt-1">We'd love to hear about your experience.</p>
                            </div>

                            <form onSubmit={handleSubmitReview} className="space-y-4 font-body">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-neutral-600 block mb-1">Your Name</label>
                                        <input required type="text" value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-neutral-900 transition-colors text-sm" placeholder="e.g. Fatima Ali" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-neutral-600 block mb-1">City / Location</label>
                                        <input required type="text" value={newReview.location} onChange={e => setNewReview({ ...newReview, location: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-neutral-900 transition-colors text-sm" placeholder="e.g. Lahore" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-neutral-600 block mb-1">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button type="button" key={star} onClick={() => setNewReview({ ...newReview, rating: star })} className="focus:outline-none">
                                                <Star size={28} fill={star <= newReview.rating ? "#F59E0B" : "none"} className={star <= newReview.rating ? "text-amber-500" : "text-neutral-300"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-neutral-600 block mb-1">Your Review</label>
                                    <textarea required value={newReview.review} onChange={e => setNewReview({ ...newReview, review: e.target.value })} rows={4} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-neutral-900 transition-colors text-sm resize-none" placeholder="Tell us how the oil helped your hair..." />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-neutral-600 block mb-1">Add Before & After Photo (Optional)</label>
                                    <div className="mt-2">
                                        {!selectedFile ? (
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-50 hover:border-neutral-300 transition-all">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                                                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Select Transformation Photo</p>
                                                    <p className="text-[10px] text-neutral-400 mt-1">PNG, JPG or JPEG (Max 5MB)</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setSelectedFile(file);
                                                    }}
                                                />
                                            </label>
                                        ) : (
                                            <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-neutral-200">
                                                <img
                                                    src={URL.createObjectURL(selectedFile)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedFile(null)}
                                                    className="absolute top-2 right-2 p-1.5 bg-neutral-900/60 text-white rounded-lg hover:bg-neutral-900 transition-colors"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                                <div className="absolute bottom-2 left-2 bg-neutral-900/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[9px] uppercase font-bold tracking-widest">
                                                    Ready to upload
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button disabled={submitting} type="submit" className="w-full bg-neutral-900 text-white font-bold py-4 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2">
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
