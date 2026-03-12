import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const QuizCTA = () => {
    return (
        <section className="py-24 bg-gradient-luxury overflow-hidden relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="glass-card rounded-[3rem] p-8 md:p-20 border border-white/20 shadow-premium flex flex-col items-center text-center">
                    <AnimatedSection className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] border border-primary/20">
                            <Sparkles size={14} />
                            Personalized Botanical Care
                        </div>

                        <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight max-w-3xl">
                            Not sure which <span className="italic text-primary">Cure</span> is right for you?
                        </h2>

                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Our 30-second hair analysis combines ancient Ayurvedic principles with modern science to find your perfect botanical match.
                        </p>

                        <div className="pt-8">
                            <Link
                                to="/quiz"
                                className="group relative inline-flex items-center gap-4 bg-foreground text-background font-bold px-12 py-5 rounded-2xl hover:bg-primary transition-all duration-500 shadow-luxury hover:shadow-gold overflow-hidden"
                            >
                                <span className="relative z-10">Take the Analysis Quiz</span>
                                <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </div>

                                {/* Hover shine effect */}
                                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 mt-8 border-t border-border/50 w-full">
                            {[
                                { label: "AI Powered", sub: "Data-Driven" },
                                { label: "100% Personal", sub: "Tailored to You" },
                                { label: "Botanical Base", sub: "Nontoxic Formula" },
                                { label: "Expert Logic", sub: "Scalp Focused" },
                            ].map((item, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-sm font-bold text-foreground uppercase tracking-wider">{item.label}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.1em]">{item.sub}</p>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

export default QuizCTA;
