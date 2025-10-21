import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Shield, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <BhindiHeader />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-pink-500 to-purple-600 bg-clip-text text-transparent">
              About Karlo Shaadi
            </h1>
            <p className="text-xl text-muted-foreground">
              India's most trusted wedding planning platform, connecting couples with verified vendors across the country
            </p>
          </div>

          {/* Our Story */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="animate-fade-up">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground text-lg">
                  <p>
                    Karlo Shaadi was founded by Prabhanjay Tiwari with a simple belief: every couple deserves a stress-free, 
                    magical wedding experience. We understand that planning a wedding in India can be overwhelming, with 
                    countless decisions to make and vendors to coordinate.
                  </p>
                  <p>
                    Our platform brings together the best wedding vendors across India - from photographers and venues to 
                    decorators and caterers - all verified and reviewed by real couples. We've made it our mission to 
                    simplify wedding planning while ensuring you find the perfect match for your special day.
                  </p>
                  <p>
                    With thousands of successful weddings and countless happy couples, we continue to innovate and improve 
                    our platform to serve you better. Your dream wedding is just a few clicks away!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Founder Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="animate-fade-up bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-2">Meet Our Founder</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-600 mx-auto"></div>
                </div>
                <div className="space-y-4 text-muted-foreground text-lg">
                  <p className="text-center">
                    <span className="text-2xl font-semibold text-foreground block mb-2">Prabhanjay Tiwari</span>
                    <span className="text-primary font-medium">Founder & CEO</span>
                  </p>
                  <p>
                    With a vision to revolutionize wedding planning in India, Prabhanjay Tiwari created Karlo Shaadi to 
                    bridge the gap between couples and trusted wedding vendors. His passion for technology and deep 
                    understanding of Indian wedding traditions have made Karlo Shaadi the go-to platform for modern couples.
                  </p>
                  <p>
                    Under Prabhanjay's leadership, Karlo Shaadi has grown to become India's most trusted wedding planning 
                    platform, helping thousands of couples create their dream weddings with ease and confidence.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="animate-fade-up text-center">
                <CardContent className="p-8">
                  <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Love First</h3>
                  <p className="text-muted-foreground">
                    Every wedding is a celebration of love, and we treat each one as unique and special
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fade-up text-center" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-8">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Trust & Safety</h3>
                  <p className="text-muted-foreground">
                    All vendors are verified and reviewed to ensure quality and reliability
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fade-up text-center" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-8">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Community</h3>
                  <p className="text-muted-foreground">
                    Building a strong community of couples and vendors helping each other
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fade-up text-center" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-8">
                  <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    Constantly improving our platform with new features and technologies
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-primary/10 via-pink-500/10 to-purple-600/10 rounded-3xl p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="animate-fade-up">
                <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
                <div className="text-muted-foreground">Happy Couples</div>
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-muted-foreground">Verified Vendors</div>
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <div className="text-muted-foreground">Cities Covered</div>
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="text-4xl font-bold text-primary mb-2">4.8/5</div>
                <div className="text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
};

export default About;
