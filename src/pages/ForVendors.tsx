import { SEO } from "@/components/SEO";
import { VendorHero } from "@/components/vendor-landing/VendorHero";
import { ProblemsSection } from "@/components/vendor-landing/ProblemsSection";
import { EarlyBirdSection } from "@/components/vendor-landing/EarlyBirdSection";
import { StepsSection } from "@/components/vendor-landing/StepsSection";
import { ToolsSection } from "@/components/vendor-landing/ToolsSection";
import { SocialProofSection } from "@/components/vendor-landing/SocialProofSection";
import { VendorPricingSection } from "@/components/vendor-landing/VendorPricingSection";
import { VendorTestimonialsSection } from "@/components/vendor-landing/VendorTestimonialsSection";
import { VendorFAQSection } from "@/components/vendor-landing/VendorFAQSection";
import { FinalCTASection } from "@/components/vendor-landing/FinalCTASection";

export default function ForVendors() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAF6EE" }}>
      <SEO
        title="Partner With KarloShaadi — Get Unlimited Wedding Leads"
        description="Join India's fastest growing wedding marketplace. Zero commission, verified leads, complete business toolkit. Register free today."
      />

      {/* Sticky nav */}
      <nav className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-between px-5 sm:px-10 py-3.5"
        style={{ background: "rgba(45,8,8,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,150,42,0.3)" }}>
        <a href="/" className="font-display font-bold text-2xl" style={{ color: "#E8B94A", letterSpacing: "0.03em" }}>
          Karlo<span className="text-white">Shaadi</span>
        </a>
        <button onClick={() => window.location.href = "/vendor/onboarding"}
          className="px-6 py-2.5 rounded-md text-xs font-semibold tracking-widest uppercase cursor-pointer transition-all duration-300 hover:-translate-y-px border-0"
          style={{ background: "linear-gradient(135deg, #C9962A, #E8B94A)", color: "#4A0E0E" }}>
          Register as Vendor →
        </button>
      </nav>

      <VendorHero />
      <ProblemsSection />
      <EarlyBirdSection />
      <StepsSection />
      <ToolsSection />
      <SocialProofSection />
      <VendorPricingSection />
      <VendorTestimonialsSection />
      <VendorFAQSection />
      <FinalCTASection />

      {/* Footer */}
      <footer className="flex items-center justify-between flex-wrap gap-4 px-5 sm:px-10 py-8"
        style={{ background: "#2D0808" }}>
        <span className="font-display text-xl" style={{ color: "#E8B94A" }}>KarloShaadi.com</span>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Contact Us", "About"].map(l => (
            <a key={l} href="#" className="text-white/40 text-xs hover:text-[#E8B94A] transition-colors">{l}</a>
          ))}
        </div>
        <span className="text-white/25 text-xs">© 2025 KarloShaadi. All rights reserved.</span>
      </footer>

      {/* WhatsApp float */}
      <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[998] w-[58px] h-[58px] rounded-full flex items-center justify-center text-2xl transition-transform hover:scale-110"
        style={{ background: "#25D366", boxShadow: "0 6px 24px rgba(37,211,102,0.45)" }}>
        💬
      </a>
    </div>
  );
}
