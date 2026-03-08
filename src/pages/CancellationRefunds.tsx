import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const CancellationRefunds = () => {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Cancellation & Refunds Policy"
        description="Understand our cancellation policy and refund process for bookings on Karlo Shaadi"
      />
      <MobilePageHeader title="Cancellation & Refunds" />
      
      <main className={isMobile ? "px-4 py-4 pb-24" : "pt-24 pb-16"}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          {!isMobile && (
            <div className="text-center mb-12 animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Cancellation & Refunds</h1>
              <p className="text-xl text-muted-foreground">
                Our policy for booking cancellations and refunds
              </p>
            </div>
          )}

          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle>Cancellation & Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p><strong>Last Updated:</strong> January 2025</p>
              
              <h3 className="text-lg font-semibold text-foreground mt-6">1. Platform Fees</h3>
              <p>
                Karlo Shaadi platform fees and service charges are non-refundable. These fees cover the cost of 
                maintaining and operating the platform, vendor verification, customer support, and payment processing.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">2. Vendor Booking Cancellations</h3>
              <p>
                Refunds for vendor bookings are subject to the individual vendor's cancellation policy. Each vendor 
                sets their own terms regarding cancellations and refunds. Karlo Shaadi facilitates these transactions 
                but does not control vendor refund policies.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">3. Cancellation Timeline</h3>
              <p>
                <strong>More than 90 days before event:</strong> Most vendors offer partial to full refunds minus processing fees.<br />
                <strong>60-90 days before event:</strong> Typically 50-75% refund depending on vendor policy.<br />
                <strong>30-60 days before event:</strong> Generally 25-50% refund as per vendor terms.<br />
                <strong>Less than 30 days before event:</strong> Most vendors do not offer refunds at this stage.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">4. Cancellation Process</h3>
              <p>
                To cancel a booking:<br />
                1. Log in to your account and go to "My Bookings"<br />
                2. Select the booking you wish to cancel<br />
                3. Click "Request Cancellation" and provide a reason<br />
                4. The vendor will review and respond within 48 hours<br />
                5. If approved, refunds will be processed within 7-14 business days
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">5. Advance Payments</h3>
              <p>
                Most vendors require advance payments or booking deposits. Refund eligibility for these payments 
                depends on the timing of cancellation and individual vendor policies. Always review vendor-specific 
                cancellation terms before making advance payments.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">6. Vendor-Initiated Cancellations</h3>
              <p>
                If a vendor cancels a confirmed booking, you are entitled to a full refund including platform fees. 
                We will also assist in finding alternative vendors at no additional cost. Contact our support team 
                immediately if this occurs.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">7. Disputes and Mediation</h3>
              <p>
                In case of disputes between couples and vendors regarding cancellations or refunds, Karlo Shaadi 
                offers mediation services. While we facilitate fair resolution, the final decision rests on the 
                contractual agreement between parties. We encourage resolving disputes amicably.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">8. Force Majeure</h3>
              <p>
                Neither party is liable for cancellations due to circumstances beyond reasonable control including 
                but not limited to natural disasters, pandemics, government restrictions, extreme weather, or venue 
                unavailability. Refunds in such cases are negotiable between parties.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">9. Refund Processing Time</h3>
              <p>
                Once a refund is approved by the vendor:<br />
                - Digital payment refunds: 5-7 business days<br />
                - Bank transfers: 7-14 business days<br />
                - Credit card refunds: 7-14 business days<br />
                Processing times may vary based on your bank or payment provider.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">10. Non-Refundable Items</h3>
              <p>
                The following are typically non-refundable:<br />
                - Platform service fees<br />
                - Payment processing charges<br />
                - Custom-made items or personalized services<br />
                - Bookings made during promotional periods (unless otherwise stated)
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">11. Contact for Support</h3>
              <p>
                For cancellation requests or refund assistance, contact our support team:<br />
                Email: support@karloshaadi.com<br />
                Live Chat: Available on our platform 9 AM - 9 PM IST<br />
                We'll help facilitate communication and guide you through the process.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  );
};

export default CancellationRefunds;
