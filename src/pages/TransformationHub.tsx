import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Filter, ShoppingBag, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TransformationCard, { Transformation } from "@/components/transformation-hub/TransformationCard";
import AnimatedSection from "@/components/AnimatedSection";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const categories = ["All", "Hair Fall", "Scalp Health", "Shine", "Growth"] as const;
type Category = (typeof categories)[number];

// Fallback mock data in case table is empty or while seeding
const FALLBACK_TRANSFORMATIONS: Transformation[] = [
    {
        id: 1,
        customerName: "Ayesha K.",
        concern: "Hair Fall",
        beforeImage: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=800&auto=format&fit=crop",
        afterImage: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop",
        duration: "4 Weeks",
        reviewLink: "#",
        product: {
            id: 1,
            name: "The Essential Cure Hair Oil",
            price: 1800,
            image_url: "/products/main-product.png",
            stock: 99
        }
    },
    {
        id: 2,
        customerName: "Sana M.",
        concern: "Growth",
        beforeImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
        afterImage: "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop",
        duration: "8 Weeks",
        reviewLink: "#",
        product: {
            id: 1,
            name: "The Essential Cure Hair Oil",
            price: 1800,
            image_url: "/products/main-product.png",
            stock: 99
        }
    }
];

const TransformationHub = () => {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [transformations, setTransformations] = useState<Transformation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useDocumentMeta({
        title: "Transformation Hub",
        description: "Visualize real results from real customers. Filter by your hair concern and see the magic of nature.",
    });

    useEffect(() => {
        fetchTransformations();
    }, []);

    const fetchTransformations = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('transformations')
                .select(`
                    *,
                    product:products(*)
                `)
                .eq('verified', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                const formattedData: Transformation[] = data.map(item => ({
                    id: item.id,
                    customerName: item.customer_name,
                    concern: item.concern as any,
                    beforeImage: item.before_url,
                    afterImage: item.after_url,
                    duration: item.duration,
                    reviewLink: item.review_url || "#",
                    product: item.product
                }));
                setTransformations(formattedData);
            } else {
                // Formatting fallback to match type
                const typedFallback: Transformation[] = FALLBACK_TRANSFORMATIONS.map(t => ({
                    ...t,
                    product: t.product || {
                        id: 1,
                        name: "The Essential Cure Hair Oil",
                        price: 1800,
                        image_url: "/products/main-product.png",
                        stock: 99
                    }
                }));
                setTransformations(typedFallback);
            }
        } catch (error) {
            console.error('Error fetching transformations:', error);
            toast.error("Failed to load transformations");
            setTransformations(FALLBACK_TRANSFORMATIONS);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTransformations = useMemo(() => {
        if (activeCategory === "All") return transformations;
        return transformations.filter(t => t.concern === activeCategory);
    }, [activeCategory, transformations]);

    // SEO Structured Data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "name": "The Essential Cure Transformation Hub",
        "description": "Before and After hair transformations using The Essential Cure products.",
        "image": transformations.map(t => t.afterImage)
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <Navbar />
            <main className="min-h-screen bg-gradient-luxury pt-40 pb-20 font-body">
                <div className="container mx-auto px-6 max-w-7xl">
                    {/* Hero Section */}
                    <AnimatedSection className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8 border border-primary/20 backdrop-blur-sm"
                        >
                            <Sparkles size={14} className="animate-pulse" /> Transformation Hub
                        </motion.div>
                        <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
                            Real Results. <span className="text-primary italic">Real People.</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl leading-relaxed opacity-80 mb-10">
                            Thousands of journeys, one shared result: healthier, stronger, more radiant hair. Filter by your concern to see proven success.
                        </p>

                        {/* Filter Bar */}
                        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${activeCategory === category
                                        ? "bg-primary text-primary-foreground border-primary shadow-gold scale-105"
                                        : "bg-white/50 text-muted-foreground border-white/20 hover:border-primary/30 hover:text-primary backdrop-blur-sm"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-center gap-2 text-muted-foreground/60 text-[10px] font-bold uppercase tracking-widest">
                            <Filter size={12} /> Showing {filteredTransformations.length} transformations
                        </div>
                    </AnimatedSection>

                    {/* Masonry-style Grid */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <Loader2 className="animate-spin text-primary" size={40} />
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Loading Transformations...</p>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredTransformations.map((transformation, i) => (
                                    <TransformationCard
                                        key={transformation.id}
                                        transformation={transformation}
                                        delay={i * 0.1}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Bottom CTA */}
                    <AnimatedSection className="mt-32 text-center glass-card rounded-[3rem] p-12 md:p-20 border border-white/30 shadow-luxury overflow-hidden relative group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6 relative z-10">Ready for your own transformation?</h2>
                        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto relative z-10">
                            Join 50,000+ happy customers and start your journey to better hair health today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                            <a
                                href="/shop"
                                className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:shadow-gold hover:-translate-y-1 transition-all active:scale-95 shimmer-gold"
                            >
                                Shop the Collection
                            </a>
                            <a
                                href="/quiz"
                                className="w-full sm:w-auto bg-white/80 backdrop-blur-md text-foreground px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest border border-primary/20 hover:border-primary/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                Take the Hair Quiz <ArrowRight size={16} />
                            </a>
                        </div>
                    </AnimatedSection>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default TransformationHub;
