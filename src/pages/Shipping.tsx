import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const Shipping = () => {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Shipping & Delivery Policy"
        description="Information about shipping and delivery for physical products and documents on Karlo Shaadi"
      />
      <MobilePageHeader title="Shipping & Delivery" />
      
      <main className={isMobile ? "px-4 py-4 pb-24" : "pt-24 pb-16"}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          {!isMobile && (
            <div className="text-center mb-12 animate-fade-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping & Delivery</h1>
              <p className="text-xl text-muted-foreground">
                Delivery information for physical items and documents
              </p>
            </div>
          )}

          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle>Shipping & Delivery Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p><strong>Last Updated:</strong> January 2025</p>
              
              <h3 className="text-lg font-semibold text-foreground mt-6">1. Service-Based Platform</h3>
              <p>
                Karlo Shaadi is primarily a service-based platform connecting couples with wedding vendors. We do 
                not typically ship physical products. However, this policy covers scenarios where physical items or 
                documents may be involved.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">2. Contract Documents</h3>
              <p>
                Booking contracts and agreements are primarily delivered digitally via email and available for 
                download through your account dashboard. Physical copies can be requested and will be sent via 
                courier at no additional cost for bookings above ₹50,000.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">3. Vendor-Provided Items</h3>
              <p>
                Some vendors may provide physical items as part of their service package (invitation samples, 
                fabric swatches, makeup kits, etc.). Shipping and delivery of these items are handled directly 
                by the vendor. Delivery timelines and charges are vendor-specific.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">4. Gift Items and Promotional Materials</h3>
              <p>
                Occasionally, Karlo Shaadi may send promotional items, welcome kits, or anniversary gifts to 
                customers. These are shipped free of charge via standard courier services. Delivery typically 
                takes 7-10 business days within India.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">5. Delivery Locations</h3>
              <p>
                We deliver to all serviceable pin codes across India. International shipping is not currently 
                available. For remote locations, delivery may take additional time. Check serviceability during 
                the booking process.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">6. Delivery Timelines</h3>
              <p>
                <strong>Metro Cities:</strong> 3-5 business days<br />
                <strong>Tier 2 Cities:</strong> 5-7 business days<br />
                <strong>Tier 3 Cities & Rural Areas:</strong> 7-10 business days<br />
                <strong>Express Delivery:</strong> 1-2 business days (additional charges apply)
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">7. Shipping Charges</h3>
              <p>
                - Contract documents: Free for bookings above ₹50,000<br />
                - Standard shipping for documents: ₹50<br />
                - Express shipping: ₹150<br />
                - Vendor-provided items: As per vendor policy<br />
                - Promotional items: Free shipping
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">8. Tracking</h3>
              <p>
                All shipments include tracking information. You will receive an email and SMS with the tracking 
                number once your item is dispatched. Track your shipment through our platform or the courier 
                partner's website.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">9. Delivery Failure</h3>
              <p>
                If delivery fails due to incorrect address, recipient unavailability, or rejection, the courier 
                will make up to 3 delivery attempts. After failed attempts, items will be returned to us. 
                Re-shipping will incur additional charges.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">10. Lost or Damaged Items</h3>
              <p>
                In the rare event that an item is lost or damaged during shipping, please contact our support team 
                within 48 hours of delivery date. We will investigate with the courier partner and arrange for 
                replacement or refund as appropriate.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">11. Address Changes</h3>
              <p>
                Address changes can be made before the item is dispatched. Once shipped, address modifications 
                depend on the courier partner's policy and may incur additional charges. Update your delivery 
                address in your account settings.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">12. Customs and Duties</h3>
              <p>
                Currently, we do not ship internationally. If international shipping becomes available in the 
                future, customers will be responsible for any customs duties, taxes, or import fees imposed by 
                the destination country.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6">13. Contact for Shipping Queries</h3>
              <p>
                For questions about shipping and delivery:<br />
                Email: shipping@karloshaadi.com<br />
                Live Chat: Available 9 AM - 9 PM IST<br />
                Our team will assist with tracking, address changes, and delivery issues.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      
    </div>
  );
};

export default Shipping;
