import { Shield, TrendingUp, Zap, Sparkles, Droplets, Leaf } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const benefits = [
  { icon: Shield, title: "Reduces Hair Fall", desc: "Strengthens follicles and reduces breakage by up to 80% with regular use." },
  { icon: TrendingUp, title: "Promotes Hair Growth", desc: "Stimulates blood circulation in the scalp for faster, healthier hair growth." },
  { icon: Zap, title: "Strengthens Roots", desc: "Deep-penetrating oils fortify roots, making hair resilient from within." },
  { icon: Sparkles, title: "Adds Natural Shine", desc: "Restores your hair's natural lustre without any greasy residue." },
  { icon: Droplets, title: "Removes Dandruff", desc: "Anti-fungal properties cleanse the scalp and eliminate dandruff from the root cause." },
  { icon: Leaf, title: "Nourishes Scalp", desc: "Botanical extracts feed the scalp with essential vitamins and nutrients for healthy growth." },
];

const Benefits = () => (
  <section id="benefits" className="py-24 bg-gradient-cream">
    <div className="container mx-auto px-6">
      <AnimatedSection className="text-center mb-16">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4">Why Choose Us</p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
          The Benefits You Deserve
        </h2>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((b, i) => (
          <AnimatedSection key={b.title} delay={i * 0.1}>
            <div className="glass-card rounded-3xl p-8 text-center hover:shadow-luxury-lg hover:-translate-y-2 transition-all duration-500 h-full">
              <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-6">
                <b.icon size={28} className="text-card" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">{b.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default Benefits;
