import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Check, RefreshCw, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

type Question = {
    id: string;
    text: string;
    options: {
        label: string;
        value: string;
        icon?: string;
    }[];
};

const QUESTIONS: Question[] = [
    {
        id: "scalp",
        text: "How would you describe your scalp?",
        options: [
            { label: "Oily (Greasy quickly)", value: "oily" },
            { label: "Dry (Itchy or flaky)", value: "dry" },
            { label: "Sensitive (Easily irritated)", value: "sensitive" },
            { label: "Normal (Balanced)", value: "normal" },
        ],
    },
    {
        id: "concern",
        text: "What is your primary hair concern?",
        options: [
            { label: "Hair Fall & Thinning", value: "hair_fall" },
            { label: "Dandruff & Itchiness", value: "dandruff" },
            { label: "Frizz & Dryness", value: "frizz" },
            { label: "Slow Growth", value: "growth" },
        ],
    },
    {
        id: "thickness",
        text: "Describe your hair thickness.",
        options: [
            { label: "Fine / Thin", value: "fine" },
            { label: "Medium", value: "medium" },
            { label: "Thick / Coarse", value: "thick" },
        ],
    },
    {
        id: "treatment",
        text: "Is your hair chemically treated?",
        options: [
            { label: "Yes (Color/Keratin)", value: "treated" },
            { label: "No (Virgin hair)", value: "natural" },
        ],
    },
];

const RECOMMENDATIONS: Record<string, { name: string; desc: string; price: string; id: string }> = {
    hair_fall: {
        id: "essential-cure",
        name: "The Essential Cure Hair Oil",
        desc: "A powerful botanical blend that strengthens roots and significantly reduces hair fall within weeks.",
        price: "PKR 1,450",
    },
    dandruff: {
        id: "essential-cure",
        name: "The Essential Cure Hair Oil",
        desc: "Deeply nourishes the scalp to eliminate dryness and flakes while promoting a healthy growth environment.",
        price: "PKR 1,450",
    },
    frizz: {
        id: "essential-cure",
        name: "The Essential Cure Hair Oil",
        desc: "Seals moisture into the hair shaft, eliminating frizz and leaving a smooth, glass-like finish.",
        price: "PKR 1,450",
    },
    growth: {
        id: "essential-cure",
        name: "The Essential Cure Hair Oil",
        desc: "The original formula that provides holistic nourishment for faster length and maximum strength.",
        price: "PKR 1,450",
    },
};

const Quiz = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [userEmail, setUserEmail] = useState("");
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [dbProducts, setDbProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from('products').select('*');
            if (data) setDbProducts(data);
        };
        fetchProducts();
    }, []);

    const handleSelect = (value: string) => {
        const newAnswers = { ...answers, [QUESTIONS[step].id]: value };
        setAnswers(newAnswers);

        if (step < QUESTIONS.length - 1) {
            setTimeout(() => setStep(step + 1), 300);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers: Record<string, string>) => {
        setIsCalculating(true);
        // Determine result based on primary concern
        const concern = finalAnswers.concern;
        const baseRecommendation = RECOMMENDATIONS[concern] || RECOMMENDATIONS.growth;

        // Try to find matching product in DB for live price and image
        const dbMatchingProduct = dbProducts.find(p =>
            p.name.toLowerCase().includes(baseRecommendation.name.toLowerCase()) ||
            p.description.toLowerCase().includes(baseRecommendation.name.toLowerCase())
        );

        setTimeout(() => {
            if (dbMatchingProduct) {
                setResult({
                    ...baseRecommendation,
                    price: `PKR ${dbMatchingProduct.price.toLocaleString()}`,
                    image_url: dbMatchingProduct.image_url,
                    name: dbMatchingProduct.name
                });
            } else {
                setResult(baseRecommendation);
            }
            setIsCalculating(false);
        }, 2000);
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userEmail || !result) return;
        setIsSending(true);

        try {
            const { error } = await supabase.from('quiz_leads').insert([
                {
                    email: userEmail,
                    name: userEmail.split('@')[0], // Fallback name
                    responses: answers,
                    recommended_product: result.name,
                    converted: false
                }
            ]);

            if (error) throw error;
            setEmailSubmitted(true);
        } catch (err) {
            console.error('Error saving lead:', err);
        } finally {
            setIsSending(false);
        }
    };

    const resetQuiz = () => {
        setStep(0);
        setAnswers({});
        setResult(null);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-luxury pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <AnimatedSection>
                            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">
                                {result ? "Your Perfect Cure" : "Find Your Cure"}
                            </h1>
                            <p className="text-muted-foreground max-w-lg mx-auto">
                                {result
                                    ? "Based on your unique profile, our experts recommend this botanical treatment."
                                    : "Answer 4 simple questions and let our botanical intelligence find your ideal match."}
                            </p>
                        </AnimatedSection>
                    </div>

                    <div className="relative min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {isCalculating ? (
                                <motion.div
                                    key="calculating"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="glass-card rounded-[2.5rem] p-12 border border-white/20 shadow-premium flex flex-col items-center justify-center text-center py-20"
                                >
                                    <RefreshCw className="w-16 h-16 text-primary animate-spin mb-6" />
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Analyzing Your Profile...</h3>
                                    <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em]">Consulting Botanical Intelligence</p>
                                </motion.div>
                            ) : result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/20 shadow-premium"
                                >
                                    <div className="flex flex-col md:flex-row gap-12 items-center">
                                        <div className="w-full md:w-1/2">
                                            <div className="aspect-square rounded-3xl bg-white flex items-center justify-center overflow-hidden border border-border shadow-inner group/img">
                                                {result.image_url ? (
                                                    <img
                                                        src={result.image_url}
                                                        alt={result.name}
                                                        className="w-full h-full object-contain p-8 group-hover/img:scale-110 transition-transform duration-1000"
                                                    />
                                                ) : (
                                                    <div className="text-center p-8">
                                                        <Sparkles size={48} className="text-primary/20 mx-auto mb-4" />
                                                        <p className="font-heading text-2xl font-bold text-foreground/20 italic">Visualizing {result.name}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full md:w-1/2 space-y-6">
                                            <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20 inline-block">
                                                98% Match
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{result.name}</h2>
                                            <p className="text-muted-foreground leading-relaxed">{result.desc}</p>
                                            <div className="text-2xl font-bold text-foreground">{result.price}</div>

                                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                                <Link
                                                    to="/shop"
                                                    className="flex-1 bg-foreground text-background font-bold py-4 rounded-2xl hover:bg-primary transition-all text-center flex items-center justify-center gap-2"
                                                >
                                                    <ShoppingBag size={20} />
                                                    Shop Now
                                                </Link>
                                                <button
                                                    onClick={resetQuiz}
                                                    className="flex-1 border border-border py-4 rounded-2xl font-bold hover:bg-white/50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <RefreshCw size={20} />
                                                    Retake Quiz
                                                </button>
                                            </div>

                                            <div className="pt-8 border-t border-border mt-8">
                                                <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-widest">
                                                    Email My Results
                                                </h4>
                                                {emailSubmitted ? (
                                                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-in fade-in zoom-in">
                                                        <Check className="shrink-0" size={18} />
                                                        <p className="text-xs font-bold">Results sent! Check your inbox shortly.</p>
                                                    </div>
                                                ) : (
                                                    <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                                                        <input
                                                            type="email"
                                                            required
                                                            placeholder="your-email@example.com"
                                                            value={userEmail}
                                                            onChange={e => setUserEmail(e.target.value)}
                                                            className="flex-1 bg-white/40 border border-white/40 rounded-2xl px-6 py-4 text-sm outline-none focus:border-primary transition-all"
                                                        />
                                                        <button
                                                            type="submit"
                                                            disabled={isSending}
                                                            className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-premium hover:shadow-gold active:scale-95 disabled:opacity-50 transition-all"
                                                        >
                                                            {isSending ? "Sending..." : "Send Results"}
                                                        </button>
                                                    </form>
                                                )}
                                                <p className="text-[9px] text-muted-foreground mt-3 uppercase tracking-widest opacity-60">
                                                    Get 10% off your first order when you join our list.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/20 shadow-premium"
                                >
                                    <div className="flex justify-between items-center mb-10">
                                        <div className="flex gap-2">
                                            {QUESTIONS.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-primary/40' : 'w-4 bg-border'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Question {step + 1} of {QUESTIONS.length}</span>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{QUESTIONS[step].text}</h3>

                                    <div className="grid gap-4">
                                        {QUESTIONS[step].options.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => handleSelect(opt.value)}
                                                className={`group w-full flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 ${answers[QUESTIONS[step].id] === opt.value
                                                    ? 'bg-primary border-primary text-primary-foreground shadow-gold scale-[1.02]'
                                                    : 'bg-white/50 border-border hover:border-primary/50 hover:bg-white'
                                                    }`}
                                            >
                                                <span className="text-lg font-medium">{opt.label}</span>
                                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${answers[QUESTIONS[step].id] === opt.value
                                                    ? 'bg-white/20 border-white'
                                                    : 'border-border group-hover:border-primary/50'
                                                    }`}>
                                                    {answers[QUESTIONS[step].id] === opt.value && <Check size={16} />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {step > 0 && (
                                        <button
                                            onClick={() => setStep(step - 1)}
                                            className="mt-8 flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                                        >
                                            <ArrowLeft size={16} />
                                            Previous Question
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatedSection delay={0.4} className="mt-20 text-center">
                        <div className="inline-block p-12 glass-card rounded-[3rem] border border-white/10 bg-white/5">
                            <Sparkles className="mx-auto mb-6 text-primary w-12 h-12" />
                            <h4 className="text-xl font-bold text-foreground mb-2">Scientific Botanical Approach</h4>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                We combine years of Ayurvedic wisdom with modern hair science to ensure every recommendation is tailored to your unique biological profile.
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Quiz;
