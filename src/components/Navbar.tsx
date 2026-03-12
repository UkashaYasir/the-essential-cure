import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, User, ShoppingCart, Package, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Benefits", href: "#benefits" },
  { label: "Ingredients", href: "#ingredients" },
  { label: "Ratings", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "/blog" },
  { label: "Results", href: "/transformations" },
  { label: "Track", href: "/track" },
  { label: "Quiz", href: "/quiz" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { items, openCart } = useCartStore();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('store_config').select('announcement_text').eq('id', 1).single();
      if (data && data.announcement_text) {
        setAnnouncement(data.announcement_text);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Announcement Bar */}
      <AnimatePresence>
        {announcement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="bg-primary text-primary-foreground text-xs md:text-sm font-semibold text-center py-2 px-4 shadow-sm"
          >
            {announcement}
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        className={`w-full transition-all duration-700 ease-[0.22,1,0.36,1] ${scrolled
          ? "fixed top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-[60]"
          : "relative py-8 bg-transparent"
          }`}
      >
        <div className={`container mx-auto flex items-center justify-between px-8 py-4 transition-all duration-700 ${scrolled
          ? "glass-frosted border-primary/20 shadow-premium scale-100 rounded-full"
          : "scale-105"
          }`}>
          <a href={isHome ? "#" : "/"} className="flex items-center gap-2 group">
            <span className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              The Essential Cure
            </span>
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => {
              const isHash = l.href.startsWith("#");
              const isActive = isHash ? location.hash === l.href : location.pathname === l.href;

              if (isHash) {
                return (
                  <a
                    key={l.href}
                    href={isHome ? l.href : `/${l.href}`}
                    className="relative text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all duration-300 py-2 group"
                  >
                    {l.label}
                    {isActive && (
                      <motion.div layoutId="nav-dot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 opacity-20" />
                  </a>
                );
              }

              return (
                <Link
                  key={l.href}
                  to={l.href}
                  className="relative text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all duration-300 py-2 group"
                >
                  {l.label}
                  {isActive && (
                    <motion.div layoutId="nav-dot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 opacity-20" />
                </Link>
              );
            })}

            <div className="h-6 w-px bg-border/40 mx-2" />

            <Link
              to="/shop"
              className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-[0.2em] px-8 py-3 rounded-full hover:shadow-gold hover:-translate-y-1 transition-all active:scale-95 shadow-lg shimmer-gold"
            >
              Shop
            </Link>

            <div className="flex items-center gap-5 ml-2">
              <Link to="/profile" className="text-foreground/70 hover:text-primary transition-all hover:scale-110" aria-label="My Profile">
                <User size={20} strokeWidth={2.5} />
              </Link>
              <button onClick={openCart} className="relative text-foreground/70 hover:text-primary transition-all hover:scale-110" aria-label="Open Cart">
                <ShoppingBag size={20} strokeWidth={2.5} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Toggle & Bag */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={openCart} className="relative text-foreground/70 hover:text-primary transition-colors" aria-label="Open Cart">
              <ShoppingBag size={22} strokeWidth={2.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-secondary text-secondary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              className="text-foreground w-10 h-10 flex items-center justify-center rounded-2xl glass-card border-white/20"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-card mx-4 mt-2 rounded-2xl overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={isHome ? l.href : `/${l.href}`}
                    onClick={() => setMobileOpen(false)}
                    className="font-body text-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
                <Link
                  to="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-gold text-card font-body text-sm font-semibold px-6 py-2.5 rounded-full text-center hover:opacity-90 transition-opacity"
                >
                  <ShoppingCart size={16} /> Shop Now
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 bg-secondary text-foreground font-body text-sm font-semibold px-6 py-2.5 rounded-full text-center hover:opacity-90 transition-opacity"
                >
                  <BookOpen size={16} /> Blog
                </Link>
                <Link
                  to="/track"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 bg-secondary text-foreground font-body text-sm font-semibold px-6 py-2.5 rounded-full text-center hover:opacity-90 transition-opacity"
                >
                  <Package size={16} /> Track Order
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 bg-secondary text-foreground font-body text-sm font-semibold px-6 py-2.5 rounded-full text-center hover:opacity-90 transition-opacity"
                >
                  <User size={16} /> My Profile
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
