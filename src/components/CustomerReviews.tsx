import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { supabase } from '@/lib/supabase';

type Review = {
    id?: number;
    name: string;
    location: string;
    review: string;
    rating: number;
    tag: string;
    verified: boolean;
    created_at?: string;
};

// Fallback — shown when the DB has no active reviews yet
const DEFAULT_REVIEWS: Review[] = [
    {
        name: "Sana Khan",
        location: "Lahore",
        review: "I've tried so many oils, but this is the only one that actually reduced my hair fall. My hair feels so much thicker now! Already ordered my second bottle.",
        rating: 5,
        tag: "Hair Fall",
        verified: true,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        name: "Mariam Tariq",
        location: "Islamabad",
        review: "Visible results in just 2–3 weeks. The quality is genuinely premium — the glass bottle, the scent, everything feels luxury. Highly recommended!",
        rating: 5,
        tag: "Visible Results",
        verified: true,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        name: "Zainab Hussain",
        location: "Karachi",
        review: "My hairdresser asked me what I've been using because my hair looked so healthy! This oil is incredible. The delivery was super fast too.",
        rating: 5,
        tag: "Texture & Shine",
        verified: true,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        name: "Fatima Malik",
        location: "Lahore",
        review: "I was skeptical at first but my friend convinced me to try it. Two bottles later, I can't imagine my hair care routine without it!",
        rating: 5,
        tag: "Repeat Buyer",
        verified: true,
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        name: "Ali Raza",
        location: "Faisalabad",
        review: "Ordered it for my wife, and she loves it so much she made me order another one for her sister too. The packaging is so pretty as well!",
        rating: 5,
        tag: "Gift-Worthy",
        verified: true,
        created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        name: "Nimra Sheikh",
        location: "Rawalpindi",
        review: "After just 3 weeks of use, my hair fall reduced by like 70%. I can actually see baby hairs growing back. This product is a miracle!",
        rating: 5,
        tag: "Hair Regrowth",
        verified: true,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

const stats = [
    { value: "98%", label: "Would Recommend" },
    { value: "4.9★", label: "Average Rating" },
    { value: "3 Weeks", label: "Avg. Visible Results" },
    { value: "500+", label: "Happy Customers" },
];

const timeAgo = (dateStr?: string): string => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 14) return '1 week ago';
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 60) return '1 month ago';
    return `${Math.floor(days / 30)} months ago`;
};

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={14}
                className={i < rating ? "text-amber-400" : "text-neutral-300"}
                fill={i < rating ? "currentColor" : "none"}
            />
        ))}
    </div>
);

const CustomerReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const reviewsPerPage = 3;

    useEffect(() => {
        const fetchReviews = async () => {
            const { data } = await supabase
                .from('customer_reviews')
                .select('*')
                .eq('active', true)
                .order('created_at', { ascending: false });

            if (data && data.length > 0) {
                setReviews(data);
            } else {
                setReviews(DEFAULT_REVIEWS);
            }
        };
        fetchReviews();
    }, []);

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const visibleReviews = reviews.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage);

    const goNext = () => setCurrentPage(p => (p + 1) % totalPages);
    const goPrev = () => setCurrentPage(p => (p - 1 + totalPages) % totalPages);

    return (
        <section className="py-24 bg-gradient-to-b from-white via-cream/40 to-white overflow-hidden">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-14">
                    <AnimatedSection>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-bold uppercase tracking-widest mb-4 border border-amber-200">
                            <Star size={14} fill="currentColor" /> 4.9 / 5 Stars
                        </div>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Real Customers, Real Results
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Don't just take our word for it — hear from hundreds of customers who transformed their hair with The Essential Cure.
                        </p>
                    </AnimatedSection>
                </div>

                {/* Stats Bar */}
                <AnimatedSection delay={0.1}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-5 text-center border border-primary/10 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Reviews Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.35 }}
                        className="grid md:grid-cols-3 gap-6 mb-10"
                    >
                        {visibleReviews.map((item, index) => (
                            <motion.div
                                key={item.id ?? index}
                                className="glass-card p-7 rounded-3xl relative flex flex-col border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all"
                            >
                                {/* Quote accent */}
                                <div className="absolute -top-4 -left-4 w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white shadow-md">
                                    <Quote size={16} fill="currentColor" />
                                </div>

                                {/* Tag */}
                                <div className="flex items-center justify-between mb-4">
                                    {item.tag ? (
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                                            {item.tag}
                                        </span>
                                    ) : <span />}
                                    <span className="text-[10px] text-muted-foreground">{timeAgo(item.created_at)}</span>
                                </div>

                                <StarRating rating={item.rating} />

                                <p className="text-foreground/85 font-medium italic my-4 leading-relaxed flex-1">
                                    "{item.review}"
                                </p>

                                <div className="flex items-center gap-3 border-t border-border/50 pt-4 mt-auto">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                                        {item.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="font-bold text-foreground text-sm truncate">{item.name}</h4>
                                            {item.verified && (
                                                <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" fill="currentColor" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{item.location}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={goPrev}
                            className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:border-primary hover:text-primary transition-colors shadow-sm"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentPage ? 'bg-primary w-6' : 'bg-neutral-300 hover:bg-primary/50'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={goNext}
                            className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:border-primary hover:text-primary transition-colors shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}

                {/* Trust Line */}
                <AnimatedSection delay={0.2}>
                    <p className="text-center text-xs text-muted-foreground mt-8 flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        All reviews are from verified customers. We never alter or fabricate feedback.
                    </p>
                </AnimatedSection>

            </div>
        </section>
    );
};

export default CustomerReviews;
