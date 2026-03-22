import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const Privacy = () => {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Privacy Policy"
        description="Learn how Karlo Shaadi collects, uses, and protects your personal information"
      />
      <MobilePageHeader title="Privacy Policy" />
      
      <main className={isMobile ? "px-4 py-4 pb-24" : "pt-24 pb-16"}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          {!isMobile && (
            <div className="text-center mb-12 ">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-xl text-muted-foreground">
                How we collect, use, and protect your information
              </p>
            </div>
          )}

          <Card className="">
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p><strong>Last Updated:</strong> January 2025</p>
              
              <h3 className="text-lg font-semibold text-foreground mt-6">1. Information We Collect</h3>
              <p>
                We collect information you provide directly (name, email, phone, wedding details), automatically 
                (usage data, device info), and from third parties (social login, payment processors).
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">2. How We Use Your Information</h3>
              <p>
                Your information helps us provide services, improve the platform, personalize your experience, 
                facilitate vendor connections, and communicate important updates.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">3. Information Sharing</h3>
              <p>
                We share information with vendors (for bookings), service providers (for operations), and as 
                required by law. We never sell your personal information.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">4. Data Security</h3>
              <p>
                We implement industry-standard security measures including encryption, secure databases, and 
                regular security audits to protect your data. However, no system is completely secure, and we 
                cannot guarantee absolute security.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">5. Your Rights</h3>
              <p>
                You can access, update, or delete your information at any time through your account settings. 
                You can opt out of marketing communications. Contact us at privacy@karloshaadi.com to exercise 
                these rights.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">6. Cookies and Tracking</h3>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and 
                provide personalized content. You can control cookies through your browser settings. Essential 
                cookies are required for basic functionality.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">7. Children's Privacy</h3>
              <p>
                Our platform is intended for users 18 years and older. We do not knowingly collect information 
                from children under 18. If you believe we have collected such information, please contact us 
                immediately.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">8. Data Retention</h3>
              <p>
                We retain your information for as long as your account is active or as needed to provide services. 
                After account deletion, we may retain certain information for legal compliance, dispute resolution, 
                and platform security purposes.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">9. International Data Transfers</h3>
              <p>
                Your information may be transferred and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place for such transfers.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">10. Changes to Privacy Policy</h3>
              <p>
                We may update this policy periodically. Significant changes will be communicated via email or 
                prominent notice on our platform. Continued use constitutes acceptance of the updated policy.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">11. Contact Us</h3>
              <p>
                For privacy-related questions or concerns, contact us at:<br />
                Email: privacy@karloshaadi.com<br />
                Address: Karlo Shaadi, Lucknow, India
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      
    </div>
  );
};

export default Privacy;
