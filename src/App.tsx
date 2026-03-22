import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { AnimatePresence, motion } from "framer-motion";
import { PageTransition } from "@/components/mobile/PageTransition";
import { WeddingPlanWizard } from "@/components/WeddingPlanWizard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { ScrollDepthCTA } from "@/components/ScrollDepthCTA";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { MobileLayout } from "@/layouts/MobileLayout";
import { AppProviders } from "@/components/AppProviders";
import { OfflineScreen } from "@/components/OfflineScreen";
import { WhatsNewModal } from "@/components/WhatsNewModal";
import { RateAppPrompt } from "@/components/RateAppPrompt";
import { PushNotificationPrompt } from "@/components/PushNotificationPrompt";
import { STALE_TIMES, CACHE_TIMES } from "@/hooks/useOptimizedQuery";

// ─── Critical pages: eagerly loaded for fast first paint ───────────────────
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import VendorAuth from "./pages/VendorAuth";
import Search from "./pages/Search";
import VendorProfile from "./pages/VendorProfile";
import City from "./pages/City";
import Categories from "./pages/Categories";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";

// ─── Non-critical pages: lazy loaded to reduce initial bundle ──────────────
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Messages = lazy(() => import("./pages/Messages"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const VendorSettings = lazy(() => import("./pages/VendorSettings"));
const VendorBilling = lazy(() => import("./pages/VendorBilling"));
const VendorOnboarding = lazy(() => import("./pages/VendorOnboarding"));
const VendorDashboard = lazy(() => import("./pages/VendorDashboard"));
const VendorPricing = lazy(() => import("./pages/VendorPricing"));
const VendorProfileSetup = lazy(() => import("./pages/VendorProfileSetup"));
const VendorVerificationStatus = lazy(() => import("./pages/VendorVerificationStatus"));
const VendorLeaderboard = lazy(() => import("./pages/VendorLeaderboard"));
const VendorSuccessStories = lazy(() => import("./pages/VendorSuccessStories"));
const VendorCheck = lazy(() => import("./pages/VendorCheck"));
const VendorMiniSitePage = lazy(() => import("./pages/VendorMiniSitePage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ForVendors = lazy(() => import("./pages/ForVendors"));
const About = lazy(() => import("./pages/About"));
const Legal = lazy(() => import("./pages/Legal"));
const Privacy = lazy(() => import("./pages/Privacy"));
const CancellationRefunds = lazy(() => import("./pages/CancellationRefunds"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Support = lazy(() => import("./pages/Support"));
const Investors = lazy(() => import("./pages/Investors"));
const JoinAsManager = lazy(() => import("./pages/JoinAsManager"));
const Affiliate = lazy(() => import("./pages/Affiliate"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"));
const BookingDetails = lazy(() => import("./pages/BookingDetails"));
const FAQ = lazy(() => import("./pages/FAQ"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const VendorGuide = lazy(() => import("./pages/VendorGuide"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PremiumUpgrade = lazy(() => import("./pages/PremiumUpgrade"));
const PremiumDashboard = lazy(() => import("./pages/PremiumDashboard"));
const SubscriptionCheckout = lazy(() => import("./pages/SubscriptionCheckout"));
const DataExport = lazy(() => import("./pages/DataExport"));
const Moodboards = lazy(() => import("./pages/Moodboards"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Deals = lazy(() => import("./pages/Deals"));
const Compare = lazy(() => import("./pages/Compare"));
const Checklist = lazy(() => import("./pages/Checklist"));
const BudgetTracker = lazy(() => import("./pages/BudgetTracker"));
const AIMatchResults = lazy(() => import("./pages/AIMatchResults"));
const Referrals = lazy(() => import("./pages/Referrals"));
const WeddingPlanResult = lazy(() => import("./pages/WeddingPlanResult"));
const BudgetCalculatorPage = lazy(() => import("./pages/BudgetCalculatorPage"));
const MuhuratFinderPage = lazy(() => import("./pages/MuhuratFinderPage"));
const InviteCreatorPage = lazy(() => import("./pages/InviteCreatorPage"));
const WeddingWebsite = lazy(() => import("./pages/WeddingWebsite"));
const WeddingView = lazy(() => import("./pages/WeddingView"));
const MusicGenerator = lazy(() => import("./pages/MusicGenerator"));
const CityVendors = lazy(() => import("./pages/CityVendors"));
const GuestList = lazy(() => import("./pages/GuestList"));
const SpeechWriterPage = lazy(() => import("./pages/SpeechWriterPage"));
const ShaadiSeva = lazy(() => import("./pages/ShaadiSeva"));
const WeddingDirectory = lazy(() => import("./pages/WeddingDirectory"));
const EmbedWidget = lazy(() => import("./pages/EmbedWidget"));
const WebStories = lazy(() => import("./pages/WebStories"));
const CoupleQuiz = lazy(() => import("./pages/CoupleQuiz"));
const FamilyFrame = lazy(() => import("./pages/FamilyFrame"));
const ShaadiWrapped = lazy(() => import("./pages/ShaadiWrapped"));
const CountdownPublic = lazy(() => import("./pages/CountdownPublic"));
const WhyKarloShaadi = lazy(() => import("./pages/WhyKarloShaadi"));
const EarnWithUs = lazy(() => import("./pages/EarnWithUs"));
const SponsorShaadi = lazy(() => import("./pages/SponsorShaadi"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const FamilyDashboard = lazy(() => import("./pages/FamilyDashboard"));
const ToolsLanding = lazy(() => import("./pages/ToolsLanding"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Stories = lazy(() => import("./pages/Stories"));
const StoryDetail = lazy(() => import("./pages/StoryDetail"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIMES.USER,
      gcTime: CACHE_TIMES.MEDIUM,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

// Routes that hide the main nav header and footer
const AUTH_ROUTES = ['/auth', '/vendor-auth', '/forgot-password', '/reset-password', '/onboarding'];

// Full-page loading skeleton shown while lazy chunks load
const PageLoadingSkeleton = () => (
  <motion.div
    className="min-h-screen bg-background flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
      <div className="space-y-2 text-center">
        <div className="h-2 w-24 bg-muted rounded-full animate-pulse" />
        <div className="h-2 w-16 bg-muted/60 rounded-full animate-pulse mx-auto" />
      </div>
    </div>
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={location.pathname}>
        <Suspense fallback={<PageLoadingSkeleton />}>
        <Routes location={location}>
          <Route path="/onboarding" element={<Onboarding />} />
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
          <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
          <Route path="/vendor-onboarding" element={<VendorOnboarding />} />
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
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/premium-upgrade" element={<ProtectedRoute><PremiumUpgrade /></ProtectedRoute>} />
          <Route path="/premium-dashboard" element={<ProtectedRoute><PremiumDashboard /></ProtectedRoute>} />
          <Route path="/subscription-checkout" element={<ProtectedRoute><SubscriptionCheckout /></ProtectedRoute>} />
          <Route path="/data-export" element={<ProtectedRoute><DataExport /></ProtectedRoute>} />
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
          <Route path="/family-dashboard" element={<ProtectedRoute><FamilyDashboard /></ProtectedRoute>} />
          <Route path="/vendor-profile-setup" element={<VendorProfileSetup />} />
          <Route path="/speech-writer" element={<SpeechWriterPage />} />
          <Route path="/shaadi-seva" element={<ShaadiSeva />} />
          <Route path="/wedding-directory" element={<WeddingDirectory />} />
          <Route path="/embed" element={<EmbedWidget />} />
          <Route path="/web-stories" element={<WebStories />} />
          <Route path="/web-stories/:id" element={<WebStories />} />
          <Route path="/couple-quiz" element={<CoupleQuiz />} />
          <Route path="/family-frame" element={<FamilyFrame />} />
          <Route path="/vendor-check" element={<VendorCheck />} />
          <Route path="/shaadi-wrapped" element={<ProtectedRoute><ShaadiWrapped /></ProtectedRoute>} />
          <Route path="/countdown/:slug" element={<CountdownPublic />} />
          <Route path="/why-karlo-shaadi" element={<WhyKarloShaadi />} />
          <Route path="/earn" element={<EarnWithUs />} />
          <Route path="/sponsor-shaadi" element={<SponsorShaadi />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/tools" element={<ToolsLanding />} />
          <Route path="/vendor-site/:slug" element={<VendorMiniSitePage />} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
};

// Inner app shell — has access to Router context for useLocation
const AppShell = () => {
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTES.some(r => location.pathname === r || location.pathname.startsWith(r));

  return (
    <AuthProvider>
      <AppProviders>
        {!isAuthRoute && <BhindiHeader />}
        <MobileLayout>
          <AnimatedRoutes />
        </MobileLayout>
        {!isAuthRoute && <BhindiFooter />}
        {!isAuthRoute && <WhatsAppButton />}
        <OfflineScreen />
        <PushNotificationPrompt />
      </AppProviders>
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ErrorBoundary>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AppShell />
          </BrowserRouter>
        </TooltipProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
