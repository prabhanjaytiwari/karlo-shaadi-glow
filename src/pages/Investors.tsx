import { useState } from "react";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Target, Users, Zap } from "lucide-react";

export default function Investors() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    investmentRange: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with Supabase or backend
    console.log("Investor interest:", formData);
    toast({
      title: "Interest Submitted!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", company: "", investmentRange: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <BhindiHeader />
      
      <main className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Invest in the Future of Weddings
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us in revolutionizing India's $50B wedding industry with technology and trust.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: TrendingUp, label: "Market Size", value: "$50B+" },
            { icon: Target, label: "Target Cities", value: "100+" },
            { icon: Users, label: "Active Vendors", value: "10K+" },
            { icon: Zap, label: "Growth Rate", value: "45% YoY" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Investment Form */}
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Submit Your Interest</h2>
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
                <Label htmlFor="company">Company/Fund Name</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="investmentRange">Investment Range</Label>
              <Input
                id="investmentRange"
                name="investmentRange"
                placeholder="e.g., $100K - $500K"
                value={formData.investmentRange}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your investment thesis..."
                className="mt-2"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Submit Interest
            </Button>
          </form>
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
}
