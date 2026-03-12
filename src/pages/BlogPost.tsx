import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { BLOG_POSTS } from './Blog';

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = BLOG_POSTS.find(p => p.slug === slug);

    useDocumentMeta({
        title: post ? post.title : 'Blog',
        description: post?.excerpt,
        ogImage: post?.image,
        ogType: 'article',
        jsonLd: post ? {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": post.image,
            "datePublished": post.date,
            "author": { "@type": "Organization", "name": "The Essential Cure" },
            "description": post.excerpt
        } : undefined
    });

    if (!post) return <Navigate to="/blog" replace />;

    const otherPosts = BLOG_POSTS.filter(p => p.slug !== slug);

    // Render simple markdown-like content
    const renderContent = (content: string) => {
        return content.trim().split('\n').map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i} className="font-heading text-xl font-bold text-foreground mt-8 mb-3">{line.slice(3)}</h2>;
            if (line.startsWith('- **')) {
                const match = line.replace('- **', '').split('**');
                return <li key={i} className="ml-4 mb-2 text-foreground/85"><strong>{match[0]}</strong>{match[1]}</li>;
            }
            if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1 text-foreground/85">{line.slice(2)}</li>;
            if (line.startsWith('---')) return <hr key={i} className="my-8 border-border" />;
            if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-sm text-muted-foreground italic bg-primary/5 px-4 py-3 rounded-xl border border-primary/10 mt-4">{line.slice(1, -1)}</p>;
            if (line.trim() === '') return <div key={i} className="h-2" />;
            return <p key={i} className="text-foreground/85 leading-relaxed">{line}</p>;
        });
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-cream pt-32 pb-16 font-body">
                <div className="container mx-auto px-6 max-w-3xl">

                    <Link to="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mb-8">
                        <ArrowLeft size={16} /> All Articles
                    </Link>

                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={11} /> {post.readTime} read</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
                        </div>
                        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6 leading-snug">{post.title}</h1>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{post.excerpt}</p>

                        <div className="aspect-[16/7] rounded-2xl overflow-hidden mb-10">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>

                        <article className="prose prose-neutral max-w-none space-y-3">
                            {renderContent(post.content)}
                        </article>
                    </motion.div>

                    {/* CTA */}
                    <div className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-amber-50 rounded-2xl border border-primary/20 text-center">
                        <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Ready to transform your hair?</h3>
                        <p className="text-muted-foreground mb-5">The Essential Cure Hair Oil — formulated to address everything in this article.</p>
                        <Link to="/cart" className="inline-flex items-center gap-2 bg-gradient-gold text-card font-semibold px-8 py-3 rounded-full shadow-luxury hover:scale-105 transition-all">
                            Order Now — PKR 1,700
                        </Link>
                    </div>

                    {/* Other Articles */}
                    {otherPosts.length > 0 && (
                        <div className="mt-12">
                            <h3 className="font-heading text-xl font-bold text-foreground mb-6">More Articles</h3>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {otherPosts.map(p => (
                                    <Link key={p.slug} to={`/blog/${p.slug}`} className="glass-card rounded-xl p-4 flex gap-4 items-start hover:shadow-md transition-shadow group">
                                        <img src={p.image} alt={p.title} className="w-20 h-16 rounded-lg object-cover flex-shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold text-primary uppercase mb-1">{p.category}</p>
                                            <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">{p.title}</h4>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock size={9} /> {p.readTime}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BlogPost;
