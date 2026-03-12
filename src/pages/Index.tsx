import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Benefits from "@/components/Benefits";
import Ingredients from "@/components/Ingredients";
import FAQSection from "@/components/FAQSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ReviewCarousel from "@/components/ReviewCarousel";
import QuizCTA from "@/components/QuizCTA";
import BeforeAfter from "@/components/BeforeAfter";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('referral_code', ref);
    }
  }, []);
  useDocumentMeta({
    title: 'Home',
    description: "Revive your hair naturally with The Essential Cure's 100% natural hair oil. Reduces hair fall, promotes growth, and adds shine. Order now — fast delivery across Pakistan.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "The Essential Cure",
      "url": "https://theessentialcure.pk",
      "logo": "https://theessentialcure.pk/og-image.png",
      "description": "Premium 100% natural hair care and revitalization.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Pakistan"
      },
      "sameAs": [
        "https://www.instagram.com/theessentialcure"
      ]
    }
  });
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Benefits />
      <Ingredients />
      <QuizCTA />
      <ReviewCarousel />
      <BeforeAfter />
      {/* <InstagramFeed /> */}{/* Commented out — re-enable when Instagram (@theessentialcure) is ready */}
      <FAQSection />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
