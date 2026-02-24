import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import VendorAuth from "./pages/VendorAuth";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Favorites from "./pages/Favorites";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import VendorSettings from "./pages/VendorSettings";
import VendorBilling from "./pages/VendorBilling";
import Categories from "./pages/Categories";
import City from "./pages/City";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import Search from "./pages/Search";
import VendorProfile from "./pages/VendorProfile";
import VendorOnboarding from "./pages/VendorOnboarding";
import VendorDashboard from "./pages/VendorDashboard";
import VendorPricing from "./pages/VendorPricing";
import AdminDashboard from "./pages/AdminDashboard";
import ForVendors from "./pages/ForVendors";
import About from "./pages/About";
import Legal from "./pages/Legal";
import Privacy from "./pages/Privacy";
import CancellationRefunds from "./pages/CancellationRefunds";
import Shipping from "./pages/Shipping";
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
import HelpCenter from "./pages/HelpCenter";
import VendorGuide from "./pages/VendorGuide";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Testimonials from "./pages/Testimonials";
import SuccessStories from "./pages/SuccessStories";
import Pricing from "./pages/Pricing";
import PremiumUpgrade from "./pages/PremiumUpgrade";
import PremiumDashboard from "./pages/PremiumDashboard";
import SubscriptionCheckout from "./pages/SubscriptionCheckout";
import NotFound from "./pages/NotFound";
import DataExport from "./pages/DataExport";
import Moodboards from "./pages/Moodboards";
import Achievements from "./pages/Achievements";
import Deals from "./pages/Deals";
import Compare from "./pages/Compare";
import Checklist from "./pages/Checklist";
import BudgetTracker from "./pages/BudgetTracker";
import AIMatchResults from "./pages/AIMatchResults";
import Referrals from "./pages/Referrals";
import VendorSuccessStories from "./pages/VendorSuccessStories";
import WeddingPlanResult from "./pages/WeddingPlanResult";
import BudgetCalculatorPage from "./pages/BudgetCalculatorPage";
import MuhuratFinderPage from "./pages/MuhuratFinderPage";
import InviteCreatorPage from "./pages/InviteCreatorPage";
import WeddingWebsite from "./pages/WeddingWebsite";
import WeddingView from "./pages/WeddingView";
import MusicGenerator from "./pages/MusicGenerator";
import CityVendors from "./pages/CityVendors";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VendorLeaderboard from "./pages/VendorLeaderboard";
import GuestList from "./pages/GuestList";
import VendorProfileSetup from "./pages/VendorProfileSetup";
import SpeechWriterPage from "./pages/SpeechWriterPage";
import { WeddingPlanWizard } from "@/components/WeddingPlanWizard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { BhindiHeader } from "@/components/BhindiHeader";
import { MobileLayout } from "@/layouts/MobileLayout";
import { AppProviders } from "@/components/AppProviders";

import VendorVerificationStatus from "./pages/VendorVerificationStatus";
import { STALE_TIMES, CACHE_TIMES } from "@/hooks/useOptimizedQuery";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIMES.USER,
      gcTime: CACHE_TIMES.MEDIUM,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ErrorBoundary>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
            <AppProviders>
            <BhindiHeader />
            <MobileLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/vendor-auth" element={<VendorAuth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
              <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
              <Route path="/booking/:id" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
              <Route path="/checkout/:bookingId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
              <Route path="/payment-failure" element={<ProtectedRoute><PaymentFailure /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/vendor/settings" element={<ProtectedRoute requireRole="vendor"><VendorSettings /></ProtectedRoute>} />
              <Route path="/vendor/billing" element={<ProtectedRoute requireRole="vendor"><VendorBilling /></ProtectedRoute>} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:category" element={<Categories />} />
              <Route path="/city/:slug" element={<City />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/stories/:id" element={<StoryDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/vendors/:id" element={<VendorProfile />} />
              <Route path="/vendors/:city/:category" element={<CityVendors />} />
              <Route path="/vendors-in/:city" element={<CityVendors />} />
              <Route path="/vendor/onboarding" element={<ProtectedRoute><VendorOnboarding /></ProtectedRoute>} />
              <Route path="/vendor-onboarding" element={<ProtectedRoute><VendorOnboarding /></ProtectedRoute>} />
              <Route path="/vendor/dashboard" element={<ProtectedRoute requireRole="vendor"><VendorDashboard /></ProtectedRoute>} />
              <Route path="/vendor-pricing" element={<VendorPricing />} />
              <Route path="/vendor/verification" element={<ProtectedRoute requireRole="vendor"><VendorVerificationStatus /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute requireRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/for-vendors" element={<ForVendors />} />
              <Route path="/about" element={<About />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cancellation-refunds" element={<CancellationRefunds />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/support" element={<Support />} />
              <Route path="/investors" element={<Investors />} />
              <Route path="/join-as-manager" element={<JoinAsManager />} />
              <Route path="/affiliate" element={<Affiliate />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/vendor-guide" element={<VendorGuide />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/premium-upgrade" element={<ProtectedRoute><PremiumUpgrade /></ProtectedRoute>} />
              <Route path="/premium-dashboard" element={<ProtectedRoute><PremiumDashboard /></ProtectedRoute>} />
              <Route path="/subscription-checkout" element={<ProtectedRoute><SubscriptionCheckout /></ProtectedRoute>} />
              <Route path="/data-export" element={<DataExport />} />
              <Route path="/moodboards" element={<ProtectedRoute><Moodboards /></ProtectedRoute>} />
              <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/checklist" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
              <Route path="/budget" element={<ProtectedRoute><BudgetTracker /></ProtectedRoute>} />
              <Route path="/ai-matches" element={<ProtectedRoute><AIMatchResults /></ProtectedRoute>} />
              <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
              <Route path="/vendor-success-stories" element={<VendorSuccessStories />} />
              <Route path="/plan-wizard" element={<WeddingPlanWizard />} />
              <Route path="/plan/:planId" element={<WeddingPlanResult />} />
              <Route path="/budget-calculator" element={<BudgetCalculatorPage />} />
              <Route path="/muhurat-finder" element={<MuhuratFinderPage />} />
              <Route path="/invite-creator" element={<InviteCreatorPage />} />
              <Route path="/wedding-website" element={<WeddingWebsite />} />
              <Route path="/wedding/:slug" element={<WeddingView />} />
              <Route path="/music-generator" element={<MusicGenerator />} />
              <Route path="/leaderboard" element={<VendorLeaderboard />} />
              <Route path="/guest-list" element={<ProtectedRoute><GuestList /></ProtectedRoute>} />
              <Route path="/vendor-profile-setup" element={<VendorProfileSetup />} />
              <Route path="/speech-writer" element={<SpeechWriterPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </MobileLayout>
            <WhatsAppButton />
            </AppProviders>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
