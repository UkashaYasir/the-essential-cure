import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const results = [
  { label: "After 4 weeks of use", before: "Thin, lifeless hair with visible scalp", after: "Noticeably thicker, fuller hair with better volume" },
  { label: "After 6 weeks of use", before: "Dry, frizzy, damaged strands", after: "Smooth, silky and deeply moisturised hair" },
  { label: "After 8 weeks of use", before: "Excessive hair fall during combing", after: "Minimal hair fall with stronger roots" },
];

const BeforeAfter = () => {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((p) => (p + 1) % results.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + results.length) % results.length), []);
  const r = results[current];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4">Transformations</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Real Results, Real People
          </h2>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid sm:grid-cols-2 gap-6"
            >
              <div className="glass-card rounded-3xl p-8 text-center">
                <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-4">Before</p>
                <div className="w-full aspect-square rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <p className="font-body text-sm text-muted-foreground px-4">{r.before}</p>
                </div>
              </div>
              <div className="glass-card rounded-3xl p-8 text-center border-primary/30">
                <p className="font-body text-xs uppercase tracking-widest text-primary mb-4">After</p>
                <div className="w-full aspect-square rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <p className="font-body text-sm text-foreground px-4 font-medium">{r.after}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="text-center font-body text-sm text-muted-foreground mt-6">{r.label}</p>

          <button
            onClick={prev}
            className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-14 glass-card p-2.5 rounded-full hover:scale-110 transition-transform"
            aria-label="Previous result"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-14 glass-card p-2.5 rounded-full hover:scale-110 transition-transform"
            aria-label="Next result"
          >
            <ChevronRight size={20} className="text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
