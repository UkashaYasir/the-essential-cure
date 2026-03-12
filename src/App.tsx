import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

// Lazy load non-critical pages for code splitting
const Cart = lazy(() => import("./pages/Cart"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Shop = lazy(() => import('./pages/Shop'));
const ReturnRequest = lazy(() => import('./pages/ReturnRequest'));
const Policies = lazy(() => import('./pages/Policies'));
const Quiz = lazy(() => import('./pages/Quiz'));
const TransformationHub = lazy(() => import('./pages/TransformationHub'));
const NotFound = lazy(() => import("./pages/NotFound"));

import FomoPopup from '@/components/FomoPopup';
import WhatsAppButton from '@/components/WhatsAppButton';
import MiniCart from '@/components/MiniCart';

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-cream">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-primary/20" />
      <div className="text-muted-foreground font-body text-sm">Loading...</div>
    </div>
  </div>
);

import AppErrorBoundary from "@/components/AppErrorBoundary";

const App = () => (
  <AppErrorBoundary>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/track" element={<OrderTracking />} />
            <Route path="/return" element={<ReturnRequest />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/privacy" element={<Policies />} />
            <Route path="/terms" element={<Policies />} />
            <Route path="/refund" element={<Policies />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/transformations" element={<TransformationHub />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <MiniCart />
        <FomoPopup />
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </AppErrorBoundary>
);

export default App;
