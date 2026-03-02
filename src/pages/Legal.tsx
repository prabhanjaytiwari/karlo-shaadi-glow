import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const Legal = () => {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Legal" />
      
      <main className={isMobile ? "px-4 py-4" : "pt-24 pb-16"}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Legal Information</h1>
            <p className="text-xl text-muted-foreground">
              Terms, policies, and guidelines for using Karlo Shaadi
            </p>
          </div>

          <Tabs defaultValue="terms" className="animate-fade-up">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="refund">Refund Policy</TabsTrigger>
            </TabsList>

            <TabsContent value="terms">
              <Card>
                <CardHeader>
                  <CardTitle>Terms of Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p><strong>Last Updated:</strong> December 2024</p>
                  
                  <h3 className="text-lg font-semibold text-foreground mt-6">1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using Karlo Shaadi, you accept and agree to be bound by these Terms of Service. 
                    If you do not agree to these terms, please do not use our platform.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">2. User Accounts</h3>
                  <p>
                    You must create an account to use certain features. You are responsible for maintaining the 
                    confidentiality of your account credentials and for all activities under your account.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">3. Vendor Verification</h3>
                  <p>
                    Vendors listed on our platform undergo verification. However, Karlo Shaadi does not guarantee 
                    the quality of services provided by vendors. Users should conduct their own due diligence.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">4. Bookings and Payments</h3>
                  <p>
                    Bookings are contracts between couples and vendors. Karlo Shaadi facilitates connections but 
                    is not a party to these contracts. Payment terms are agreed upon between parties.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">5. Content Ownership</h3>
                  <p>
                    Users retain ownership of content they post but grant Karlo Shaadi a license to use, display, 
                    and distribute this content on our platform for operational purposes.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">6. Prohibited Activities</h3>
                  <p>
                    Users may not engage in fraudulent activities, harassment, spam, or any behavior that violates 
                    applicable laws or harms the platform or other users.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">7. Termination</h3>
                  <p>
                    We reserve the right to suspend or terminate accounts that violate these terms or engage in 
                    activities harmful to the platform or its users.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p><strong>Last Updated:</strong> December 2024</p>
                  
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
                    We implement industry-standard security measures to protect your data. However, no system is 
                    completely secure, and we cannot guarantee absolute security.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">5. Your Rights</h3>
                  <p>
                    You can access, update, or delete your information. You can opt out of marketing communications. 
                    Contact us to exercise these rights.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">6. Cookies</h3>
                  <p>
                    We use cookies and similar technologies to enhance your experience, analyze usage, and provide 
                    personalized content. You can control cookies through your browser settings.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">7. Children's Privacy</h3>
                  <p>
                    Our platform is not intended for users under 18. We do not knowingly collect information from 
                    children.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="refund">
              <Card>
                <CardHeader>
                  <CardTitle>Refund & Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p><strong>Last Updated:</strong> December 2024</p>
                  
                  <h3 className="text-lg font-semibold text-foreground mt-6">1. Platform Fees</h3>
                  <p>
                    Karlo Shaadi platform fees are non-refundable. These fees cover the cost of maintaining and 
                    operating the platform.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">2. Vendor Bookings</h3>
                  <p>
                    Refunds for vendor bookings are subject to the individual vendor's cancellation policy. 
                    Karlo Shaadi facilitates these transactions but does not control refund policies.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">3. Cancellation Process</h3>
                  <p>
                    To cancel a booking, contact the vendor directly through our messaging system. Cancellation 
                    terms vary by vendor and should be discussed before finalizing bookings.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">4. Advance Payments</h3>
                  <p>
                    Most vendors require advance payments. Refund eligibility for these payments depends on the 
                    timing of cancellation and vendor policies. Review these policies carefully before booking.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">5. Disputes</h3>
                  <p>
                    In case of disputes between couples and vendors, Karlo Shaadi may mediate but is not responsible 
                    for refund decisions. We encourage resolving disputes amicably.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">6. Force Majeure</h3>
                  <p>
                    Neither party is liable for delays or failures due to circumstances beyond reasonable control 
                    (natural disasters, pandemics, government actions). Refunds in such cases are negotiable.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground mt-6">7. Contact for Support</h3>
                  <p>
                    For refund requests or cancellation assistance, contact our support team. We'll help facilitate 
                    communication between parties and guide you through the process.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      
    </div>
  );
};

export default Legal;
