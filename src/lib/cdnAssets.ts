// Centralized CDN asset map — all images served from Supabase Storage CDN as WebP
const CDN_BASE = "https://qeutvpwskilkbgynhrai.supabase.co/storage/v1/object/public/site-assets";

export const cdn = {
  // Bento grid
  bentoChaos: `${CDN_BASE}/bento-chaos.webp`,
  bentoMagic: `${CDN_BASE}/bento-magic.webp`,
  bentoProtection: `${CDN_BASE}/bento-protection.webp`,
  bentoRelaxed: `${CDN_BASE}/bento-relaxed.webp`,
  bentoVendors: `${CDN_BASE}/bento-vendors.webp`,

  // Categories
  categoryBridalMakeup: `${CDN_BASE}/category-bridal-makeup.webp`,
  categoryCake: `${CDN_BASE}/category-cake.webp`,
  categoryCatering: `${CDN_BASE}/category-catering.webp`,
  categoryChoreography: `${CDN_BASE}/category-choreography.webp`,
  categoryDecoration: `${CDN_BASE}/category-decoration.webp`,
  categoryEntertainment: `${CDN_BASE}/category-entertainment.webp`,
  categoryInvitations: `${CDN_BASE}/category-invitations.webp`,
  categoryJewelry: `${CDN_BASE}/category-jewelry.webp`,
  categoryMakeup: `${CDN_BASE}/category-makeup.webp`,
  categoryMehendi: `${CDN_BASE}/category-mehendi.webp`,
  categoryMusic: `${CDN_BASE}/category-music.webp`,
  categoryPandit: `${CDN_BASE}/category-pandit.webp`,
  categoryPhotography: `${CDN_BASE}/category-photography.webp`,
  categoryTransport: `${CDN_BASE}/category-transport.webp`,
  categoryVenue: `${CDN_BASE}/category-venue.webp`,

  // Congrats
  congratsVendor: `${CDN_BASE}/congrats-vendor.webp`,

  // Deals
  dealEarlyBird: `${CDN_BASE}/deal-early-bird.webp`,
  dealMonsoonWedding: `${CDN_BASE}/deal-monsoon-wedding.webp`,
  dealWinterWedding: `${CDN_BASE}/deal-winter-wedding.webp`,

  // Hero images
  heroAboutFounder: `${CDN_BASE}/hero-about-founder.webp`,
  heroAuthCouple: `${CDN_BASE}/hero-auth-couple.webp`,
  heroAuthMandap: `${CDN_BASE}/hero-auth-mandap.webp`,
  heroAuthVendor: `${CDN_BASE}/hero-auth-vendor.webp`,
  heroBokehDark: `${CDN_BASE}/hero-bokeh-dark.webp`,
  heroBokehRed: `${CDN_BASE}/hero-bokeh-red.webp`,
  heroCategoriesMosaic: `${CDN_BASE}/hero-categories-mosaic.webp`,
  heroDashboardPlanning: `${CDN_BASE}/hero-dashboard-planning.webp`,
  heroFaqSupport: `${CDN_BASE}/hero-faq-support.webp`,
  heroPricingCarefree: `${CDN_BASE}/hero-pricing-carefree.webp`,
  heroShaadiSeva: `${CDN_BASE}/hero-shaadi-seva.webp`,
  heroVendorsSuccess: `${CDN_BASE}/hero-vendors-success.webp`,
  heroWeddingPhere: `${CDN_BASE}/hero-wedding-phere.webp`,
  heroWedding: `${CDN_BASE}/hero-wedding.webp`,

  // Icons
  iconCake: `${CDN_BASE}/icon-cake.webp`,
  iconCatering: `${CDN_BASE}/icon-catering.webp`,
  iconCouple: `${CDN_BASE}/icon-couple.webp`,
  iconDecoration: `${CDN_BASE}/icon-decoration.webp`,
  iconGifts: `${CDN_BASE}/icon-gifts.webp`,
  iconHeart: `${CDN_BASE}/icon-heart.webp`,
  iconMehendi: `${CDN_BASE}/icon-mehendi.webp`,
  iconMusic: `${CDN_BASE}/icon-music.webp`,
  iconPhotography: `${CDN_BASE}/icon-photography.webp`,
  iconVenue: `${CDN_BASE}/icon-venue.webp`,

  // Logo
  logo: `${CDN_BASE}/logo-new.webp`,

  // Menu images
  menuCategories: `${CDN_BASE}/menu-categories.webp`,
  menuDeals: `${CDN_BASE}/menu-deals.webp`,
  menuSeva: `${CDN_BASE}/menu-seva.webp`,

  // Onboarding
  onboardingCoupleHero: `${CDN_BASE}/onboarding-couple-hero.webp`,
  onboardingStep1: `${CDN_BASE}/onboarding-step-1.webp`,
  onboardingStep2: `${CDN_BASE}/onboarding-step-2.webp`,
  onboardingStep3: `${CDN_BASE}/onboarding-step-3.webp`,
  onboardingStep4: `${CDN_BASE}/onboarding-step-4.webp`,
  onboardingStep5: `${CDN_BASE}/onboarding-step-5.webp`,
  onboardingStep6: `${CDN_BASE}/onboarding-step-6.webp`,

  // Prizes
  prizeCash1l: `${CDN_BASE}/prize-cash-1l.webp`,
  prizeCash50k: `${CDN_BASE}/prize-cash-50k.webp`,
  prizeDubai: `${CDN_BASE}/prize-dubai.webp`,
  prizeIphone: `${CDN_BASE}/prize-iphone.webp`,
  prizeMacbook: `${CDN_BASE}/prize-macbook.webp`,
  prizeMaldives: `${CDN_BASE}/prize-maldives.webp`,
  prizeMore: `${CDN_BASE}/prize-more.webp`,
  prizeSafari: `${CDN_BASE}/prize-safari.webp`,

  // Section images
  sectionCouples: `${CDN_BASE}/section-couples.webp`,
  sectionHumorRescue: `${CDN_BASE}/section-humor-rescue.webp`,
  sectionHumorVendors: `${CDN_BASE}/section-humor-vendors.webp`,
  sectionProcess: `${CDN_BASE}/section-process.webp`,
  sectionVendors: `${CDN_BASE}/section-vendors.webp`,
  sectionVenue: `${CDN_BASE}/section-venue.webp`,

  // Tools
  toolBudgetCalculator: `${CDN_BASE}/tool-budget-calculator.webp`,
  toolBudgetRoast: `${CDN_BASE}/tool-budget-roast.webp`,
  toolCoupleQuiz: `${CDN_BASE}/tool-couple-quiz.webp`,
  toolInviteCreator: `${CDN_BASE}/tool-invite-creator.webp`,
  toolMuhuratFinder: `${CDN_BASE}/tool-muhurat-finder.webp`,
  toolMusicGenerator: `${CDN_BASE}/tool-music-generator.webp`,
  toolSpeechWriter: `${CDN_BASE}/tool-speech-writer.webp`,
  toolVendorScore: `${CDN_BASE}/tool-vendor-score.webp`,
  toolWeddingPlanner: `${CDN_BASE}/tool-wedding-planner.webp`,

  // Wedding photos
  weddingBengaliBride: `${CDN_BASE}/wedding-bengali-bride.webp`,
  weddingBridalHair: `${CDN_BASE}/wedding-bridal-hair.webp`,
  weddingBride: `${CDN_BASE}/wedding-bride.webp`,
  weddingBridesmaids: `${CDN_BASE}/wedding-bridesmaids.webp`,
  weddingCatering: `${CDN_BASE}/wedding-catering.webp`,
  weddingCeremony: `${CDN_BASE}/wedding-ceremony.webp`,
  weddingCouple1: `${CDN_BASE}/wedding-couple-1.webp`,
  weddingCouple2: `${CDN_BASE}/wedding-couple-2.webp`,
  weddingCoupleRomantic: `${CDN_BASE}/wedding-couple-romantic.webp`,
  weddingDecoration: `${CDN_BASE}/wedding-decoration.webp`,
  weddingFireworks: `${CDN_BASE}/wedding-fireworks.webp`,
  weddingFriends: `${CDN_BASE}/wedding-friends.webp`,
  weddingHaldi: `${CDN_BASE}/wedding-haldi.webp`,
  weddingManagerCta: `${CDN_BASE}/wedding-manager-cta.webp`,
  weddingManifesting: `${CDN_BASE}/wedding-manifesting.webp`,
  wizardHeroWedding: `${CDN_BASE}/wizard-hero-wedding.webp`,
} as const;

export type CdnAssetKey = keyof typeof cdn;
