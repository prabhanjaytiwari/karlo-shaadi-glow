import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Favorites from "./pages/Favorites";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories";
import City from "./pages/City";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import Search from "./pages/Search";
import VendorProfile from "./pages/VendorProfile";
import VendorOnboarding from "./pages/VendorOnboarding";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ForVendors from "./pages/ForVendors";
import About from "./pages/About";
import Legal from "./pages/Legal";
import Support from "./pages/Support";
import Investors from "./pages/Investors";
import JoinAsManager from "./pages/JoinAsManager";
import Affiliate from "./pages/Affiliate";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingDetails from "./pages/BookingDetails";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Testimonials from "./pages/Testimonials";
import SuccessStories from "./pages/SuccessStories";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import DataExport from "./pages/DataExport";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ErrorBoundary>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/booking/:id" element={<BookingDetails />} />
              <Route path="/checkout/:bookingId" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failure" element={<PaymentFailure />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:category" element={<Categories />} />
              <Route path="/city/:slug" element={<City />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/stories/:id" element={<StoryDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/vendors/:id" element={<VendorProfile />} />
              <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
              <Route path="/vendor-onboarding" element={<VendorOnboarding />} />
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/for-vendors" element={<ForVendors />} />
              <Route path="/about" element={<About />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/support" element={<Support />} />
              <Route path="/investors" element={<Investors />} />
              <Route path="/join-as-manager" element={<JoinAsManager />} />
              <Route path="/affiliate" element={<Affiliate />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/data-export" element={<DataExport />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <WhatsAppButton />
          </BrowserRouter>
        </TooltipProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
