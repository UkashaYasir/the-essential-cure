import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import blogImg1 from '@/assets/blog-1.jpg';
import blogImg2 from '@/assets/blog-2.jpg';
import blogImg3 from '@/assets/blog.jpg';

export const BLOG_POSTS = [
    {
        slug: '5-signs-you-need-hair-oil',
        title: '5 Signs Your Hair Desperately Needs a Natural Oil Treatment',
        excerpt: 'Is your hair dry, dull, or shedding more than usual? These 5 warning signs mean it\'s time to start oiling — and why natural oils work better than anything else.',
        image: blogImg1,
        readTime: '4 min',
        date: 'February 20, 2026',
        category: 'Hair Care Tips',
        content: `
Your hair talks to you — you just have to know how to listen. Here are the unmistakable signs that your scalp and hair are crying out for nourishment.

## 1. Excessive Hair Fall
Losing more than 100 strands a day? That's a red flag. Weak hair roots caused by poor scalp circulation and lack of moisture are the #1 cause of hair fall. A regular oil massage stimulates blood flow and strengthens follicles from the root.

## 2. Dry, Brittle Ends
If your hair snaps easily or feels like straw, it's moisture-starved. Natural oils seal the hair shaft and prevent moisture from escaping — something no chemical conditioner can do long-term.

## 3. Dull, Lifeless Appearance
Healthy hair reflects light. Dull hair means the outer layer (cuticle) is damaged. Natural oils smooth down the cuticle, restoring that natural glass-like shine almost immediately.

## 4. Itchy or Flaky Scalp
An itchy scalp usually means dryness or irritation. Natural oils like those in The Essential Cure contain anti-inflammatory and anti-fungal properties that soothe and balance the scalp's microbiome.

## 5. Slow Hair Growth
Hair grows from follicles that need nutrients and circulation. If your hair seems to grow very slowly, your scalp is likely under-nourished. Regular oiling delivers nutrients directly where they're needed most.

---

*The Essential Cure Hair Oil is formulated specifically to target all 5 of these problems with a blend of 100% natural botanical oils. See results in as little as 2–3 weeks.*
    `,
    },
    {
        slug: 'how-to-apply-hair-oil-correctly',
        title: 'How to Apply Hair Oil the Right Way (Most People Get This Wrong)',
        excerpt: 'Applying oil straight from the bottle onto dry hair? You\'re doing it wrong. Here\'s the step-by-step method that maximizes absorption and delivers real results.',
        image: blogImg2,
        readTime: '5 min',
        date: 'February 10, 2026',
        category: 'How-To Guide',
        content: `
Most people pour oil on their hair and call it a day. But the application method matters just as much as the oil itself. Here's the right way to do it.

## Step 1: Warm the Oil
Cold oil sits on the scalp surface. Warm oil penetrates the hair shaft. Place the bottle in warm water for 2–3 minutes before use. Warm oil also massages more easily and feels incredible.

## Step 2: Section Your Hair
Don't just apply to the top. Divide your hair into 4–6 sections and apply to each section, focusing on the scalp and roots. This ensures even distribution.

## Step 3: Massage in Circular Motions
Use your fingertips (not nails) to massage the scalp in small circular motions for at least 5 minutes. This is non-negotiable. Massage = blood circulation = faster growth. Sets a timer.

## Step 4: Apply to the Lengths
After the scalp, run the remaining oil through the mid-lengths and ends. Don't overdo it — just a thin coat to protect and moisturize.

## Step 5: Leave it On (Minimum 2 Hours)
Overnight is best. Cover with a silk or satin bonnet/scarf to protect your pillow and enhance absorption. The longer, the better!

## Step 6: Wash Out Properly
Apply your shampoo BEFORE wetting hair — this breaks down the oil more effectively. Then rinse and shampoo again normally.

---

*Consistency beats everything. 3x per week for the first month, then 2x per week for maintenance. You'll notice the difference by week 3.*
    `,
    },
    {
        slug: 'diy-scalp-massage-guide',
        title: 'The DIY Scalp Massage Guide That Changed Everything',
        excerpt: 'A 10-minute scalp massage combined with the right oil can do more for your hair than 6 months of expensive salon treatments. Here\'s exactly how.',
        image: blogImg3,
        readTime: '6 min',
        date: 'January 28, 2026',
        category: 'Scalp Health',
        content: `
Scalp massage isn't a luxury — it's one of the most scientifically-backed hair growth techniques there is. Studies have shown that even 4 minutes of daily scalp massage increases hair thickness over 24 weeks. Here's your complete guide.

## Why Scalp Massage Works
Massage mechanically stretches hair follicle cells, which signals them to produce thicker hair. Combined with oil, the mechanical action also drives nutrients deeper into the follicle.

## The Classic Technique (5 minutes)
Using medium pressure with all 10 fingertips, apply circular motions starting from the nape of the neck and working forward to the hairline. Move systematically — don't just scratch randomly.

## The Inversion Method (2 minutes)
Hang your head below your heart level (sit on a chair and lean forward, or lie on the edge of a bed). The increased blood flow to the scalp is dramatic. Massage in this position for 2 minutes maximum.

## Pressure Points to Focus On
- **DU 20** (top of head, center) — main point for hair growth
- **GB 20** (base of skull, either side) — reduces stress-related hair loss
- **ST 36** (calf, below kneecap) — general health, surprisingly effective for hair when pressed daily

## Combining With The Essential Cure Oil
Apply a small amount of warmed The Essential Cure Hair Oil to your fingertips before each massage. The oils penetrate instantly when massaged in, rather than sitting on the surface.

## How Often?
- Daily: 5-minute dry massage (no oil)
- 3x/week: Full oil massage session (10 minutes)
- Weekly: Inversion method with oil (right after application)

---

*Remember: 90% of people who quit hair care routines do so before the 4-week mark. The real results come between weeks 4–12. Commit, and you'll see the change.*
    `,
    },
];

const Blog = () => {
    useDocumentMeta({
        title: 'Hair Care Blog',
        description: 'Expert hair care tips, guides, and tutorials from The Essential Cure.',
    });

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-cream pt-32 pb-16 font-body">
                <div className="container mx-auto px-6 max-w-5xl">

                    <div className="mb-12">
                        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mb-6">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest mb-4 border border-primary/20">
                            📖 Hair Care Journal
                        </div>
                        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Hair Care Tips & Guides</h1>
                        <p className="text-muted-foreground max-w-xl">
                            Expert advice to help you get the most out of your hair care routine — from application techniques to scalp health.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {BLOG_POSTS.map((post, i) => (
                            <motion.article
                                key={post.slug}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card rounded-2xl overflow-hidden group hover:shadow-luxury transition-shadow"
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock size={11} /> {post.readTime} read
                                        </span>
                                    </div>
                                    <h2 className="font-heading text-lg font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed line-clamp-2">{post.excerpt}</p>
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-3 transition-all"
                                    >
                                        Read Article <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Blog;
