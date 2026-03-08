import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AIWeddingPlanner } from "@/components/AIWeddingPlanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Calendar, Gift, PhoneCall, Crown, 
  TrendingUp, Users, MessageCircle, FileCheck 
} from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PremiumDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check for AI Premium subscription
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('plan', 'ai_premium')
        .eq('status', 'active')
        .maybeSingle();

      if (!sub) {
        navigate("/pricing");
        return;
      }

      setSubscription(sub);
      loadConsultations(session.user.id);
      loadDiscounts();
    } catch (error) {
      console.error("Error:", error);
      navigate("/pricing");
    } finally {
      setLoading(false);
    }
  };

  const loadConsultations = async (userId: string) => {
    const { data } = await supabase
      .from('consultation_bookings')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true })
      .limit(5);
    
    if (data) setConsultations(data);
  };

  const loadDiscounts = async () => {
    const { data } = await supabase
      .from('vendor_discounts')
      .select(`
        *,
        vendors (business_name, category)
      `)
      .contains('applicable_to', ['ai_premium'])
      .eq('is_active', true)
      .limit(10);
    
    if (data) setDiscounts(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const features = [
    {
      icon: Sparkles,
      title: "AI Wedding Planner",
      description: "24/7 intelligent assistant for all your wedding questions",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: PhoneCall,
      title: "Personal Consultant",
      description: "2 video calls per month with expert wedding planners",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Gift,
      title: "Exclusive Discounts",
      description: "5% off on bookings with participating vendors",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Crown,
      title: "Priority Support",
      description: "24/7 concierge service via WhatsApp",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5">
      
      
      <main className="flex-1 pt-20 md:pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Badge variant="premium" className="mb-2">
                  <Crown className="h-3 w-3 mr-1" />
                  AI Premium Active
                </Badge>
                <h1 className="text-4xl font-bold">Premium Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Your AI-powered wedding planning command center
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {features.map((feature, i) => (
              <Card key={i} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-3`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* AI Chat - Takes 2 columns */}
            <div className="lg:col-span-2 animate-fade-up" style={{ animationDelay: '400ms' }}>
              <div className="h-[600px]">
                <AIWeddingPlanner />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Consultations */}
              <Card className="animate-fade-up" style={{ animationDelay: '500ms' }}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Consultations
                  </CardTitle>
                  <CardDescription>
                    {consultations.length > 0 ? 'Your upcoming video calls' : 'No consultations booked'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {consultations.length > 0 ? (
                    <div className="space-y-3">
                      {consultations.map((consultation) => (
                        <div key={consultation.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm">
                              {new Date(consultation.scheduled_at).toLocaleDateString()}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {consultation.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(consultation.scheduled_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} • {consultation.duration_minutes} mins
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <PhoneCall className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        Book your first consultation call
                      </p>
                      <Button size="sm" variant="outline">
                        Schedule Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Exclusive Discounts */}
              <Card className="animate-fade-up" style={{ animationDelay: '600ms' }}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="h-5 w-5 text-accent" />
                    Exclusive Discounts
                  </CardTitle>
                  <CardDescription>
                    {discounts.length} vendors offering 5% off
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {discounts.length > 0 ? (
                    <div className="space-y-2">
                      {discounts.slice(0, 5).map((discount: any) => (
                        <div key={discount.id} className="flex items-center justify-between p-2 bg-accent/5 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{discount.vendors?.business_name}</p>
                            <p className="text-xs text-muted-foreground">{discount.vendors?.category}</p>
                          </div>
                          <Badge variant="accent" className="text-xs">
                            {discount.discount_percentage}% OFF
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Exclusive discounts will appear here
                    </p>
                  )}
                  {discounts.length > 5 && (
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      View All Discounts
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Support Card */}
              <Card className="animate-fade-up" style={{ animationDelay: '700ms' }}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    24/7 Concierge
                  </CardTitle>
                  <CardDescription>
                    Need urgent help? We're here!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full mb-2" variant="default">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}
