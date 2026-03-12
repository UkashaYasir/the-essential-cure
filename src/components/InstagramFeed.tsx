import { Instagram } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import heroProduct1 from "@/assets/hero-product.png";
import heroProduct2 from "@/assets/hero-product-2.png";
import heroProduct3 from "@/assets/hero-product-3.png";
import aboutImage from "@/assets/about-image.png";

const posts = [heroProduct1, heroProduct2, heroProduct3, aboutImage, heroProduct1, heroProduct2];

const InstagramFeed = () => (
  <section className="py-24 bg-gradient-cream">
    <div className="container mx-auto px-6">
      <AnimatedSection className="text-center mb-12">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4">Follow Us</p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          @theessentialcure
        </h2>
        <p className="font-body text-muted-foreground">Join our community for hair care tips & transformations</p>
      </AnimatedSection>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {posts.map((src, i) => (
          <AnimatedSection key={i} delay={i * 0.05}>
            <a
              href="https://www.instagram.com/theessentialcure"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative group rounded-2xl overflow-hidden aspect-square"
            >
              <img
                src={src}
                alt={`Instagram post ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-300 flex items-center justify-center">
                <Instagram className="text-card opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={28} />
              </div>
            </a>
          </AnimatedSection>
        ))}
      </div>

      <div className="text-center mt-10">
        <a
          href="https://www.instagram.com/theessentialcure"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border-2 border-primary text-foreground font-body font-semibold px-8 py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          <Instagram size={18} />
          Follow on Instagram
        </a>
      </div>
    </div>
  </section>
);

export default InstagramFeed;
