import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedSection from "./AnimatedSection";

const faqs = [
  { q: "Is it suitable for all hair types?", a: "Yes! The Essential Cure hair oil is formulated to work beautifully on all hair types — straight, wavy, curly, or coily. Its lightweight, non-greasy formula absorbs well regardless of your hair texture." },
  { q: "How often should I use it?", a: "For best results, we recommend applying the oil 2-3 times per week. Massage gently into your scalp and leave it on for at least 1-2 hours before washing, or overnight for deep conditioning." },
  { q: "When will I see results?", a: "Most customers notice reduced hair fall within 2-3 weeks of consistent use. Visible hair growth and improved shine typically appear after 4-6 weeks of regular application." },
  { q: "Are there any side effects?", a: "Our oil is 100% natural with no chemicals, parabens, or sulphates. It is safe for all ages and has no known side effects. If you have specific allergies, please review our full ingredient list." },
  { q: "Can men use this product?", a: "Absolutely! The Essential Cure is designed for everyone. Many of our male customers have seen excellent results in reducing thinning and promoting thicker growth." },
];

const FAQSection = () => (
  <section id="faq" className="py-24 bg-background">
    <div className="container mx-auto px-6 max-w-3xl">
      <AnimatedSection className="text-center mb-16">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4">Got Questions?</p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
          Frequently Asked Questions
        </h2>
      </AnimatedSection>

      <AnimatedSection>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="glass-card rounded-2xl px-6 border-none"
            >
              <AccordionTrigger className="font-heading text-lg font-semibold text-foreground hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </AnimatedSection>
    </div>
  </section>
);

export default FAQSection;
