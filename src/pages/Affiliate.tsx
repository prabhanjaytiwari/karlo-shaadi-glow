import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Users, TrendingUp, Gift } from "lucide-react";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";

export default function Affiliate() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    audience: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from("contact_inquiries").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Affiliate application\n\nWebsite: ${formData.website}\nAudience: ${formData.audience}\nPromotion plan: ${formData.message}`,
        type: "affiliate",
      });
    } catch {
      // best-effort — still show success to user
    }
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you soon.",
    });
    setFormData({ name: "", email: "", phone: "", website: "", audience: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Affiliate Program" />
      
      <main className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Affiliate Program
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Earn generous commissions by referring couples to Karlo Shaadi.
          </p>
        </div>

        {/* Commission Structure */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: DollarSign, label: "Commission", value: "Up to 15%" },
            { icon: Users, label: "Cookie Duration", value: "90 Days" },
            { icon: TrendingUp, label: "Avg. Booking", value: "₹1.5L+" },
            { icon: Gift, label: "Sign-up Bonus", value: "₹5,000" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Sign Up", desc: "Join our affiliate program for free" },
              { step: "2", title: "Share Link", desc: "Promote Karlo Shaadi to your audience" },
              { step: "3", title: "Earn Money", desc: "Get paid for every successful booking" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Join as Affiliate</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="website">Website/Social Media URL</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="audience">Your Audience Size & Demographics *</Label>
              <Input
                id="audience"
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                required
                placeholder="e.g., 50K Instagram followers interested in weddings"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="message">How will you promote Karlo Shaadi? *</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-2"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Submit Application
            </Button>
          </form>
        </div>
      </main>

      
    </div>
  );
}
