import { Leaf } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const ingredients = [
  { name: "Black Seed Oil (Kalonji)", desc: "Ancient remedy that thickens hair, reduces hair fall, and promotes new growth." },
  { name: "Bhringraj", desc: "Known as the 'King of Herbs' for hair, promotes growth and prevents greying." },
  { name: "Coconut Oil", desc: "Deeply penetrates the hair shaft, reducing protein loss and adding moisture." },
  { name: "Amla Extract", desc: "Rich in Vitamin C, strengthens follicles and adds volume to thinning hair." },
  { name: "Rosemary Oil", desc: "Improves scalp circulation and stimulates new hair growth naturally." },
  { name: "Castor Oil", desc: "Thickens hair strands and promotes faster, healthier growth at the roots." },
  { name: "Argan Oil", desc: "Rich in fatty acids and antioxidants, adds deep moisture and silky smoothness." },
  { name: "Tea Tree Oil", desc: "Powerful anti-fungal and antibacterial properties eliminate dandruff and scalp infections." },
  { name: "Onion Extract", desc: "Boosts blood supply to follicles and provides sulfur for stronger keratin production." },
];

const Ingredients = () => (
  <section id="ingredients" className="py-24 bg-background">
    <div className="container mx-auto px-6">
      <AnimatedSection className="text-center mb-16">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4">Pure & Natural</p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
          Handpicked Ingredients
        </h2>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ingredients.map((ing, i) => (
          <AnimatedSection key={ing.name} delay={i * 0.08}>
            <div className="glass-card rounded-2xl p-6 hover:shadow-luxury transition-all duration-400 group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Leaf size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">{ing.name}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{ing.desc}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default Ingredients;
