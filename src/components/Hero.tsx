import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Leaf, Users, Droplets, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { trackAddToCart } from "@/lib/analytics";

// Product Images
import heroProduct1 from "@/assets/hero-product.png";
import heroProduct2 from "@/assets/hero-product-2.png";
import heroProduct3 from "@/assets/hero-product-3.png";

const productImages = [heroProduct1, heroProduct2, heroProduct3];

const AnimatedTitle = ({ text }: { text: React.ReactNode }) => {
  // If text is a string, split into characters. If it's a fragment/node, we handle specifically
  // for this project, titles are often fragments with a gradient span.
  return (
    <motion.h1
      className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-foreground mb-8"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {/* Extract text from node to animate letters if it's a simple structure */}
      {typeof text === 'string' ? (
        text.split('').map((char, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {char}
          </motion.span>
        ))
      ) : (
        <motion.span
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {text}
        </motion.span>
      )}
    </motion.h1>
  );
};

// Text slides — only the text changes, images stay on the right cycling independently
const textSlides = [
  {
    id: 1,
    subtitle: "The Essential Cure",
    title: (
      <>
        Revive Your Hair{" "}
        <span className="text-gradient-gold italic">Naturally</span>
      </>
    ),
    desc: "100% Natural Formula for Stronger, Healthier, Shinier Hair — crafted with love from nature's finest ingredients.",
    showStats: false,
  },
  {
    id: 2,
    subtitle: "Our Story",
    title: (
      <>
        Nature's Remedy <span className="text-gradient-gold italic">for Your Hair</span>
      </>
    ),
    desc: "Born from a deep-rooted belief in the power of nature, The Essential Cure blends ancient Ayurvedic wisdom with modern science. Every drop is infused with handpicked botanical extracts — perfect for both men and women.",
    showStats: true,
  },
  {
    id: 3,
    subtitle: "Pure & Organic",
    title: (
      <>
        Premium <span className="text-gradient-gold italic">Hair Growth</span> Oil
      </>
    ),
    desc: "Contains natural DHT blockers, strengthens roots, reduces thinning, and nourishes your scalp with 15+ powerful botanical ingredients.",
    showStats: false,
  },
];

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);
  const [isSaleActive, setIsSaleActive] = useState(false);
  const [saleMultiplier, setSaleMultiplier] = useState(1);
  const [basePrice, setBasePrice] = useState(1700);

  // Mouse Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  // Parallax transforms for various elements
  const productX = useTransform(dx, [-500, 500], [20, -20]);
  const productY = useTransform(dy, [-500, 500], [20, -20]);
  const blob1X = useTransform(dx, [-500, 500], [-30, 30]);
  const blob1Y = useTransform(dy, [-500, 500], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };

  // Fetch store config for sale status
  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('store_config').select('is_sale_active, sale_multiplier, product_price').eq('id', 1).single();
      if (data) {
        setIsSaleActive(data.is_sale_active);
        setSaleMultiplier(data.sale_multiplier);
        setBasePrice(data.product_price);
      }
    };
    fetchConfig();
  }, []);

  // Text slide transitions
  const nextText = useCallback(() => setCurrentText((p) => (p + 1) % textSlides.length), []);

  // Product image transitions
  const nextImg = useCallback(() => setCurrentImg((p) => (p + 1) % productImages.length), []);
  const prevImg = useCallback(() => setCurrentImg((p) => (p - 1 + productImages.length) % productImages.length), []);

  // Auto-cycle text every 6 seconds
  useEffect(() => {
    const timer = setInterval(nextText, 6000);
    return () => clearInterval(timer);
  }, [nextText]);

  // Auto-cycle product images every 4 seconds
  useEffect(() => {
    const timer = setInterval(nextImg, 4000);
    return () => clearInterval(timer);
  }, [nextImg]);

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-luxury pt-20"
    >

      {/* Dynamic Animated Backdrop Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ x: blob1X, y: blob1Y }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 -top-20 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -left-20 bottom-10 w-[700px] h-[700px] rounded-full bg-secondary/5 blur-[150px]"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-24 grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center w-full relative z-10">

        {/* ========== TEXT SIDE ========== */}
        <div className="text-center lg:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {isSaleActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 bg-white/40 border border-white/20 text-primary px-5 py-2 rounded-full mb-8 backdrop-blur-md shadow-premium shimmer-gold"
                >
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    Limited Event: {Math.round((1 - saleMultiplier) * 100)}% Savings Applied
                  </span>
                </motion.div>
              )}
              <p className="font-body text-[10px] uppercase tracking-[0.6em] text-primary font-bold mb-5 opacity-80">
                {textSlides[currentText].subtitle}
              </p>
              <AnimatedTitle text={textSlides[currentText].title} />
              <p className="font-body text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed opacity-90">
                {textSlides[currentText].desc}
              </p>

              {textSlides[currentText].showStats && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-10 mb-12">
                  <div className="flex flex-col items-center lg:items-start gap-1">
                    <div className="flex items-center gap-2 text-primary">
                      <Leaf size={20} className="glow-gold" />
                      <span className="font-heading text-2xl font-bold">100%</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Botanic Pure</span>
                  </div>
                  <div className="flex flex-col items-center lg:items-start gap-1">
                    <div className="flex items-center gap-2 text-secondary">
                      <Users size={20} />
                      <span className="font-heading text-2xl font-bold">10K+</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Community</span>
                  </div>
                  <div className="flex flex-col items-center lg:items-start gap-1">
                    <div className="flex items-center gap-2 text-primary">
                      <Droplets size={20} className="glow-gold" />
                      <span className="font-heading text-2xl font-bold">15+</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Rare Oils</span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <Link
              to="/cart"
              onClick={trackAddToCart}
              className="group relative flex items-center justify-center gap-4 bg-primary text-primary-foreground font-body font-bold px-12 py-6 rounded-full shadow-gold hover:shadow-premium hover:-translate-y-1.5 transition-all duration-500 overflow-hidden shimmer-gold active:scale-95"
            >
              <ShoppingCart size={22} />
              <span className="tracking-tight">Secure Yours</span>
              <span className="ml-2 pl-5 border-l border-primary-foreground/30 font-heading text-xl">
                PKR {isSaleActive ? Math.round(basePrice * saleMultiplier) : basePrice}
              </span>
            </Link>
            <a
              href="#ingredients"
              className="flex items-center justify-center gap-2 px-12 py-6 rounded-full border border-primary/20 text-foreground font-bold hover:bg-white/50 hover:backdrop-blur-md transition-all duration-500 active:scale-95"
            >
              The Science
            </a>
          </div>

          <div className="flex gap-4 mt-16 justify-center lg:justify-start">
            {textSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentText(i)}
                className={`h-1 rounded-full transition-all duration-1000 ${i === currentText ? "bg-primary w-16" : "bg-primary/10 w-6 hover:bg-primary/30"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ========== IMAGE SIDE ========== */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-72 h-72 sm:w-[32rem] sm:h-[32rem] lg:w-[38rem] lg:h-[38rem] group mx-auto">

            {/* Parallax Container */}
            <motion.div
              style={{ x: productX, y: productY }}
              className="w-full h-full relative"
            >
              {/* Product Glow */}
              <div className="absolute inset-0 rounded-full bg-primary/25 blur-[100px] opacity-40 transform scale-90" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImg}
                  initial={{ opacity: 0, scale: 0.85, rotateY: -15, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.15, rotateY: 15, filter: "blur(10px)" }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 20
                  }}
                  className="w-full h-full relative z-10 flex items-center justify-center"
                >
                  <img
                    src={productImages[currentImg]}
                    alt="The Essential Cure Premium Bottle"
                    draggable={false}
                    className="w-[85%] h-[85%] object-contain drop-shadow-[0_45px_60px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform duration-700 pointer-events-none"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Interaction Layer */}
            <div className="absolute inset-0 z-20" />

            {/* Nav Arrows */}
            <div className="absolute -inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button onClick={prevImg} className="pointer-events-auto w-12 h-12 rounded-2xl glass-card flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextImg} className="pointer-events-auto w-12 h-12 rounded-2xl glass-card flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Detail Tag */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -right-4 top-1/4 z-30 glass-card p-4 rounded-3xl shadow-premium hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Droplets size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Purity Lvl</p>
                  <p className="font-heading text-lg font-bold">100% Oil</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
