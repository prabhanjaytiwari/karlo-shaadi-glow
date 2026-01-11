import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, TrendingUp, Users, Shield } from "lucide-react";
import { SEO } from "@/components/SEO";

const ForVendors = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="For Wedding Vendors - Join Karlo Shaadi"
        description="Grow your wedding business with Karlo Shaadi. Connect with couples, increase bookings, and manage your vendor profile."
      />
      <BhindiHeader />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Grow Your Wedding Business
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of wedding vendors connecting with couples across India
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/vendor-auth")}
              className="text-lg px-8 py-6"
            >
              Register as Vendor
            </Button>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="hover-lift">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Reach More Couples</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get discovered by thousands of couples planning their weddings
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Increase Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage inquiries and bookings efficiently with our platform
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Verified Badge</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get verified to build trust and stand out from competitors
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CheckCircle2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Easy Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dashboard to manage your profile, bookings, and payments
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* How it Works */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                  <p className="text-muted-foreground">
                    Sign up and create a detailed vendor profile showcasing your services, portfolio, and pricing
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Get Verified</h3>
                  <p className="text-muted-foreground">
                    Complete verification to earn a trusted badge and appear higher in search results
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Receive Inquiries</h3>
                  <p className="text-muted-foreground">
                    Couples will discover your profile and send booking requests directly to you
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Grow Your Business</h3>
                  <p className="text-muted-foreground">
                    Manage bookings, build your reputation with reviews, and scale your wedding business
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button 
                size="lg" 
                onClick={() => navigate("/vendor-auth")}
                className="text-lg px-8 py-6"
              >
                Start Your Free Profile
              </Button>
            </div>
          </div>
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
};

export default ForVendors;