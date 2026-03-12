import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import aboutImage from "@/assets/about-image.png";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blogMain from "@/assets/blog.jpg";

const storyImages = [aboutImage, blogMain, blog1, blog2];

const About = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % storyImages.length);
    }, 4000); // 4 seconds interval
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <AnimatedSection>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-luxury-lg bg-white/40">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={storyImages[currentImage]}
                alt="Our Story Illustration"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-contain p-4"
                loading="lazy"
                decoding="async"
                width="500"
                height="625"
              />
            </AnimatePresence>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {storyImages.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === currentImage ? "w-6 bg-primary" : "w-1.5 bg-white/50"
                    }`}
                />
              ))}
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4">Our Story</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Nature's Remedy for Your Hair
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-6">
            Born from a deep-rooted belief in the power of nature, The Essential Cure blends ancient Ayurvedic wisdom with modern science to create a hair oil that truly transforms. Every drop is infused with handpicked botanical extracts — no chemicals, no shortcuts.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed mb-8">
            We believe your hair deserves the purest care. Our oil deeply nourishes each strand from root to tip, reviving damaged hair and promoting growth the way nature intended.
          </p>
          <div className="flex flex-wrap gap-6 sm:gap-12">
            <div>
              <p className="font-heading text-3xl font-bold text-primary">100%</p>
              <p className="font-body text-sm text-muted-foreground">Natural</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-primary">10K+</p>
              <p className="font-body text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-primary">15+</p>
              <p className="font-body text-sm text-muted-foreground">Ingredients</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default About;
