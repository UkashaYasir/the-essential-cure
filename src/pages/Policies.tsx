import { motion } from 'framer-motion';
import { Shield, FileText, RotateCcw, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

const Policies = () => {
    const location = useLocation();
    const type = location.pathname.replace('/', '') as 'privacy' | 'terms' | 'refund';

    const content = {
        privacy: {
            title: 'Privacy Policy',
            icon: Shield,
            lastUpdated: 'March 2026',
            sections: [
                {
                    h: 'Information We Collect',
                    p: 'We collect information you provide directly to us (name, phone, address) when placing an order or creating a profile. This is essential for delivering your The Essential Cure hair oil safely.'
                },
                {
                    h: 'Data Security',
                    p: 'Your data is stored securely using Supabase. We do not sell or share your personal information with third-party advertisers. We only use your data to process orders and improve our services.'
                },
                {
                    h: 'WhatsApp Communication',
                    p: 'We use your phone number to send order updates and handle customer support via WhatsApp. You can opt-out at any time.'
                }
            ]
        },
        terms: {
            title: 'Terms of Service',
            icon: FileText,
            lastUpdated: 'March 2026',
            sections: [
                {
                    h: 'Using Our Services',
                    p: 'By accessing this website, you agree to follow our rules and use our products as intended. All hair oil formulas are artisanal and natural.'
                },
                {
                    h: 'Order Acceptance',
                    p: 'We reserve the right to refuse any order. If we cancel an order after payment, we will issue a full refund to your original payment method.'
                },
                {
                    h: 'Intellectual Property',
                    p: 'The Essential Cure brand, logo, and content are protected by copyright law. Please do not use them without permission.'
                }
            ]
        },
        refund: {
            title: 'Refund Policy',
            icon: RotateCcw,
            lastUpdated: 'March 2026',
            sections: [
                {
                    h: 'Returns Window',
                    p: 'We offer a 7-day return policy for unused and unopened products. If you are not satisfied with your purchase, please contact us within 7 days of delivery.'
                },
                {
                    h: 'Return Process',
                    p: 'To initiate a return, use our Return Request form or contact us on WhatsApp. You will be responsible for shipping costs for returning the item.'
                },
                {
                    h: 'Refund Processing',
                    p: 'Once we receive and inspect your return, we will notify you of the approval or rejection. If approved, your refund will be processed within 5-7 business days.'
                }
            ]
        }
    }[type] || { title: 'Policy', icon: Shield, lastUpdated: 'N/A', sections: [] };

    useDocumentMeta({ title: content.title, description: `Read our ${content.title} to understand how we protect you.` });

    const Icon = content.icon;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-cream pt-32 pb-16 font-body">
                <div className="container mx-auto px-6 max-w-3xl">
                    <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-12 transition-colors">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-[3rem] p-10 md:p-16 shadow-luxury"
                    >
                        <div className="flex items-center gap-6 mb-12">
                            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-inner">
                                <Icon size={40} />
                            </div>
                            <div>
                                <h1 className="font-heading text-4xl font-bold text-foreground mb-2">{content.title}</h1>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Last Updated: {content.lastUpdated}</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {content.sections.map((s, i) => (
                                <div key={i} className="group">
                                    <h2 className="font-heading text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{s.h}</h2>
                                    <p className="text-muted-foreground leading-relaxed text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                                        {s.p}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 pt-12 border-t border-border flex flex-col items-center text-center">
                            <p className="text-sm text-muted-foreground mb-6">Need further clarification?</p>
                            <Link to="/#contact" className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest shadow-gold hover:shadow-premium hover:-translate-y-1 transition-all">
                                Contact Support
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Policies;
