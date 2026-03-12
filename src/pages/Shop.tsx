import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Package, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/store/cartStore';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import AnimatedSection from '@/components/AnimatedSection';
import ReviewCarousel from '@/components/ReviewCarousel';
import heroProduct from '@/assets/hero-product.png';
import heroProduct2 from '@/assets/hero-product-2.png';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    sale_price?: number;
    image_url: string;
    stock: number;
    rating: number;
    soldCount: number;
};

// Fallback products when no products are in DB yet
const FALLBACK_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'The Essential Cure Hair Oil',
        description: '100% Natural Formula — Reduces hair fall, promotes growth, and adds natural shine. Crafted with pure botanical oils for visible results in 2–3 weeks.',
        price: 1700,
        sale_price: 1450,
        image_url: "/hero-product-2.png",
        stock: 99,
        rating: 4.9,
        soldCount: 766,
    }
];

const Shop = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem, openCart } = useCartStore();

    useDocumentMeta({
        title: 'Shop',
        description: 'Shop The Essential Cure natural hair oil — fast delivery across Pakistan.',
        ogImage: heroProduct,
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "The Essential Cure Collection",
            "description": "Premium natural hair care products.",
            "mainEntity": (products.length > 0 ? products : FALLBACK_PRODUCTS).map(p => ({
                "@type": "Product",
                "name": p.name,
                "description": p.description,
                "image": p.image_url,
                "offers": {
                    "@type": "Offer",
                    "price": p.sale_price || p.price,
                    "priceCurrency": "PKR",
                    "availability": p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                }
            }))
        }
    });

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('active', true)
                .order('created_at', { ascending: false });

            if (data && data.length > 0) {
                setProducts(data);
            } else {
                setProducts(FALLBACK_PRODUCTS);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-luxury pt-40 pb-20 font-body">
                <div className="container mx-auto px-6 max-w-7xl">

                    {/* Header */}
                    <AnimatedSection className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-primary/20 backdrop-blur-sm"
                        >
                            <ShoppingBag size={14} /> The Collection
                        </motion.div>
                        <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">Artisanal Hair Care</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed opacity-80">
                            100% natural, scientifically-backed formulas designed to restore your hair's natural vitality and radiance.
                        </p>
                    </AnimatedSection>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 size={48} className="animate-spin text-primary" />
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Curating Essentials...</span>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {products.map((product, i) => {
                                const isSale = product.sale_price && product.sale_price < product.price;
                                const displayPrice = isSale ? product.sale_price! : product.price;

                                return (
                                    <AnimatedSection key={product.id} delay={i * 0.1}>
                                        <div className="group relative glass-card rounded-[2.5rem] overflow-hidden hover:shadow-premium transition-all duration-700 border border-white/20 h-full flex flex-col">
                                            {/* Badge */}
                                            {isSale && (
                                                <div className="absolute top-6 left-6 z-10 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-gold">
                                                    Special Offer
                                                </div>
                                            )}
                                            {product.stock <= 5 && product.stock > 0 && (
                                                <div className="absolute top-6 right-6 z-10 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                                    Low Stock
                                                </div>
                                            )}

                                            {/* Image container */}
                                            <div className="relative aspect-square overflow-hidden bg-white/50">
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-1000 ease-out"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                            </div>

                                            {/* Content */}
                                            <div className="p-8 flex flex-col flex-grow">
                                                <div className="flex items-center gap-1 text-primary mb-3">
                                                    {[...Array(5)].map((_, starIdx) => (
                                                        <Star
                                                            key={starIdx}
                                                            size={12}
                                                            fill={starIdx < Math.floor(product.rating || 4.9) ? "currentColor" : "none"}
                                                            className={starIdx < Math.floor(product.rating || 4.9) ? "" : "text-primary"}
                                                        />
                                                    ))}
                                                    <span className="text-[10px] font-bold text-muted-foreground ml-2 uppercase tracking-widest">{product.rating || 4.9} ({product.soldCount || 766}+)</span>
                                                </div>
                                                <h3 className="font-heading text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                                                <p className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed flex-grow">
                                                    {product.description}
                                                </p>

                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex flex-col">
                                                        {isSale && (
                                                            <span className="text-xs text-muted-foreground line-through opacity-50">PKR {product.price.toLocaleString()}</span>
                                                        )}
                                                        <span className="text-xl font-bold text-foreground">PKR {displayPrice.toLocaleString()}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            addItem(product);
                                                            openCart();
                                                        }}
                                                        disabled={product.stock === 0}
                                                        className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-luxury
                                                            ${product.stock === 0
                                                                ? 'bg-muted/20 text-muted-foreground cursor-not-allowed'
                                                                : 'bg-primary text-primary-foreground hover:scale-110 active:scale-95 hover:shadow-premium'
                                                            }`}
                                                    >
                                                        {product.stock === 0 ? <Package size={20} /> : <ShoppingBag size={20} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </AnimatedSection>
                                );
                            })}
                        </div>
                    )}

                    {/* Product Features Highlight */}
                    <AnimatedSection delay={0.2} className="mt-32">
                        <div className="glass-card rounded-[3rem] overflow-hidden border border-white/20 shadow-premium max-w-4xl mx-auto">
                            <div className="grid md:grid-cols-2 items-center">
                                <div className="p-12 md:p-16 space-y-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                                        <Sparkles size={12} /> Key Features
                                    </div>
                                    <h2 className="font-heading text-4xl font-bold text-foreground leading-tight">
                                        Designed for <span className="text-gradient-gold">Visible Results</span>
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Our formula isn't just oil — it's a precisely engineered blend of botanical extracts and DHT blockers designed to stop hair fall at the source.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Natural DHT Blockers",
                                            "Strengthens Hairs & Stops Fall",
                                            "Strongly Reverse Hair Thinning"
                                        ].map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                    <ArrowRight size={14} />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white/50 p-8 h-full flex items-center justify-center">
                                    <img
                                        src="/product-features.png"
                                        alt="Product Features Diagram"
                                        className="w-full max-w-sm drop-shadow-2xl rounded-2xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Trust Section */}
                    <AnimatedSection delay={0.4} className="mt-40 pt-20 border-t border-border">
                        <div className="grid md:grid-cols-3 gap-12 text-center">
                            {[
                                { icon: ShoppingBag, title: "Fast Delivery", desc: "Across all major cities in Pakistan" },
                                { icon: Star, title: "Premium Quality", desc: "100% natural and artisanal formula" },
                                { icon: Package, title: "Secure Checkout", desc: "Pay with Cash or Digital Wallet" }
                            ].map((item, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-luxury text-primary">
                                        <item.icon size={28} />
                                    </div>
                                    <h4 className="font-heading text-xl font-bold text-foreground">{item.title}</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </div>

            {/* Testimonials */}
            <ReviewCarousel />

            <Footer />
        </>
    );
};

export default Shop;
