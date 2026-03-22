import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Target, Users, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { investorInquirySchema, sanitizeInput } from "@/lib/validation";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type InvestorFormData = z.infer<typeof investorInquirySchema>;

export default function Investors() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InvestorFormData>({
    resolver: zodResolver(investorInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      investmentRange: "",
      message: "",
    },
  });

  const handleSubmit = async (data: InvestorFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("investor_inquiries")
        .insert([{
          name: sanitizeInput(data.name),
          email: sanitizeInput(data.email),
          phone: data.phone || null,
          company: data.company ? sanitizeInput(data.company) : null,
          investment_range: data.investmentRange || null,
          message: data.message ? sanitizeInput(data.message) : null,
        }]);

      if (error) throw error;

      toast({
        title: "Interest Submitted!",
        description: "We'll get back to you within 24 hours.",
      });
      
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Investors" />
      
      <main className={isMobile ? "px-4 py-4 pb-24" : "container mx-auto px-4 py-20"}>
        <div className={isMobile ? "" : "text-center mb-16 animate-fade-in"}>
          {!isMobile && (
            <>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Invest in the Future of Weddings
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join us in revolutionizing India's $50B wedding industry with technology and trust.
              </p>
            </>
          )}
        </div>

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

        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Submit Your Interest</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input className="mt-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" className="mt-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" className="mt-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company/Fund Name</FormLabel>
                      <FormControl>
                        <Input className="mt-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="investmentRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Range</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $100K - $500K" className="mt-2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Tell us about your investment thesis..."
                        className="mt-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Interest"}
              </Button>
            </form>
          </Form>
        </div>
      </main>

    </div>
  );
}