import { useState, useEffect } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
// import { Instagram } from "lucide-react"; // Commented out — re-enable when Instagram (@theessentialcure) is ready
import AnimatedSection from "./AnimatedSection";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("923186393760");

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('store_config').select('whatsapp_number').eq('id', 1).single();
      if (data && data.whatsapp_number) {
        setWhatsappNumber(data.whatsapp_number);
      }
    };
    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: form.name,
          email: form.email,
          message: form.message
        }]);

      if (error) throw error;

      setSent(true);
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 3000);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-cream">
      <div className="container mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-primary mb-4">Get In Touch</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Order & Contact
          </h2>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Quick Links */}
          <AnimatedSection>
            <div className="space-y-6">
              <p className="font-body text-muted-foreground leading-relaxed mb-8">
                Ready to transform your hair? Order directly through WhatsApp or send us a message. We'd love to hear from you!
              </p>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '').replace(/^0/, '92')}?text=Hi! I'd like to order The Essential Cure Hair Oil`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass-card rounded-2xl p-5 hover:shadow-luxury transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <MessageCircle size={22} className="text-green-600" />
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">Join WhatsApp</p>
                  <p className="font-body text-sm text-muted-foreground">Quick & easy ordering</p>
                </div>
              </a>

              {/* Instagram — Commented out, re-enable when Instagram (@theessentialcure) is ready
              <a
                href="https://www.instagram.com/theessentialcure"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass-card rounded-2xl p-5 hover:shadow-luxury transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Instagram size={22} className="text-primary" />
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">Follow on Instagram</p>
                  <p className="font-body text-sm text-muted-foreground">@theessentialcure</p>
                </div>
              </a>
              */}
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection delay={0.2}>
            <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-5">
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1.5 block">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                  placeholder="Your message"
                />
              </div>
              <button
                type="submit"
                disabled={loading || sent}
                className="w-full bg-gradient-gold text-card font-body font-semibold px-6 py-3.5 rounded-full flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-luxury transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {sent ? "Sent! We'll get back to you." : loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Contact;
