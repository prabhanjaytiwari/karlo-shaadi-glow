import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Star, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface SmartVendorMatchProps {
  category?: string;
  budget?: { min: number; max: number };
  city?: string;
}

export const SmartVendorMatch = ({ category, budget, city }: SmartVendorMatchProps) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { toast } = useToast();

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please log in to get personalized vendor recommendations",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("smart-vendor-matching", {
        body: {
          userId: user.id,
          category,
          budget,
          city,
        },
      });

      if (error) throw error;

      setRecommendations(data.vendors || []);
      
      toast({
        title: "✨ Smart Matches Found!",
        description: `Found ${data.vendors?.length || 0} perfect vendors for you using ${data.method === 'ai_powered' ? 'AI analysis' : 'smart filtering'}`,
      });
    } catch (error: any) {
      console.error("Smart matching error:", error);
      toast({
        title: "Error getting recommendations",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            <CardTitle>AI-Powered Smart Matching</CardTitle>
          </div>
          <CardDescription>
            Get personalized vendor recommendations based on your preferences, budget, and past interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={getRecommendations}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Analyzing Your Preferences...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Get Smart Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h3 className="text-xl font-bold">Your Perfect Matches</h3>
            <Badge variant="accent">AI Powered</Badge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.map((vendor, index) => (
              <Link key={vendor.id} to={`/vendors/${vendor.id}`}>
                <Card className="hover:shadow-lg transition-all hover:border-accent/50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg">{vendor.business_name}</h4>
                        <Badge variant="secondary" className="mt-1">
                          {vendor.category}
                        </Badge>
                      </div>
                      <Badge className="bg-accent/10 text-accent border-accent/20">
                        #{index + 1} Match
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {vendor.description || "Professional wedding services"}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span className="font-semibold">{vendor.average_rating || 0}</span>
                        <span className="text-muted-foreground">({vendor.total_reviews || 0})</span>
                      </div>
                      {vendor.cities?.name && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{vendor.cities.name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
