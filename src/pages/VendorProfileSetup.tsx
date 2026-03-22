import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Camera, Search, MessageSquare, Star, Zap, Shield, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { initiatePayment, createRazorpayCheckout, verifyPayment } from "@/lib/paymentUtils";
import { z } from "zod";
import { motion } from "framer-motion";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().min(10, "Valid phone number required").max(15),
  business_name: z.string().trim().min(2, "Business name is required").max(200),
  category: z.string().min(1, "Category is required"),
  city: z.string().trim().min(2, "City is required").max(100),
  instagram_handle: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(500).optional(),
});

type FormData = z.infer<typeof formSchema>;

const categories = [
  "Photography", "Videography", "Makeup Artist", "Mehendi Artist",
  "Decorator", "Caterer", "DJ/Music", "Choreographer", "Venue",
  "Wedding Planner", "Invitation Cards", "Pandit/Priest", "Transport",
  "Jewellery", "Bridal Wear", "Groom Wear", "Cake & Desserts", "Entertainment", "Other"
];

const includes = [
  { icon: Camera, text: "Professional business description" },
  { icon: Camera, text: "Portfolio upload & arrangement (up to 20 photos)" },
  { icon: Search, text: "SEO-optimized profile for city search" },
  { icon: Zap, text: "Category & service listing setup" },
  { icon: MessageSquare, text: "WhatsApp & contact configuration" },
  { icon: Shield, text: "Verification-ready profile" },
];

const testimonials = [
  { name: "Rajesh Sharma", category: "Photographer, Delhi", quote: "Got 12 leads in the first week after my profile was set up!" },
  { name: "Priya Mehendi Arts", category: "Mehendi Artist, Jaipur", quote: "I didn't know how to create an online profile. They made it so easy!" },
  { name: "Royal Caterers", category: "Caterer, Mumbai", quote: "Professional profile brought us 3x more inquiries than before." },
];

const VendorProfileSetup = () => {
  const [form, setForm] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const isMobile = useIsMobile();

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmitAndPay = async () => {
    const result = formSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(e => { fieldErrors[e.path[0] as string] = e.message; });
      setErrors(fieldErrors);
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = await initiatePayment({ amount: 999, description: "Vendor Profile Setup Service" });

      const razorpay = createRazorpayCheckout(orderData, {
        description: "Vendor Profile Setup - ₹999",
        onSuccess: async (response) => {
          try {
            await verifyPayment(response);

            const { error } = await supabase.from("vendor_setup_orders" as any).insert({
              name: result.data.name,
              phone: result.data.phone,
              business_name: result.data.business_name,
              category: result.data.category,
              city: result.data.city,
              instagram_handle: result.data.instagram_handle || null,
              notes: result.data.notes || null,
              razorpay_payment_id: response.razorpay_payment_id,
              amount: 999,
              status: "paid",
            });

            if (error) throw error;
            setIsComplete(true);
            toast({ title: "Payment successful! 🎉", description: "Our team will set up your profile within 48 hours." });
          } catch (err: any) {
            toast({ title: "Error saving order", description: err.message, variant: "destructive" });
          }
        },
        onFailure: () => {
          toast({ title: "Payment failed", description: "Please try again.", variant: "destructive" });
        },
        onDismiss: () => setIsProcessing(false),
      });

      razorpay.open();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Order Confirmed - Vendor Profile Setup" description="Your vendor profile setup order has been confirmed." />
        <div className="container max-w-2xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6">
            <CheckCircle className="w-20 h-20 text-primary mx-auto" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Payment Successful! 🎉</h1>
          <p className="text-lg text-muted-foreground mb-2">Our team will create your professional profile within <strong>48 hours</strong>.</p>
          <p className="text-muted-foreground mb-8">You'll receive a WhatsApp message on your registered number with profile details and a link to review.</p>
          <Button onClick={() => window.location.href = "/"} size="lg">Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Vendor Profile Setup Service - ₹999 | Karlo Shaadi"
        description="Get your professional vendor profile created by experts."
      />
      <MobilePageHeader title="Profile Setup" />

      {/* Hero */}
      <section className={isMobile ? "relative bg-muted/20 py-6 px-4" : "relative bg-muted/20 py-16 md:py-24"}>
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-accent/20 text-accent-foreground border-accent/30">Limited Time Offer</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            We'll Build Your Profile <span className="text-primary">FOR You</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Don't have time to create your online presence? Our experts will set up a professional, lead-generating vendor profile on Karlo Shaadi.
          </p>
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-2xl text-muted-foreground line-through">₹2,999</span>
            <span className="text-4xl font-bold text-primary">₹999</span>
            <Badge variant="destructive" className="text-sm">67% OFF</Badge>
          </div>
          <Button size="lg" onClick={() => document.getElementById("setup-form")?.scrollIntoView({ behavior: "smooth" })} className="gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-card">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-foreground mb-10">What's Included</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {includes.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-foreground mb-10">Vendors Love It</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-accent text-accent" />)}</div>
                  <p className="text-foreground mb-4 italic">"{t.quote}"</p>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="setup-form" className="py-16 bg-card">
        <div className="container max-w-xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">Fill Your Details</h2>
          <p className="text-center text-muted-foreground mb-8">We'll create your profile and notify you within 48 hours.</p>

          <div className="space-y-4">
            <div>
              <Label>Your Name *</Label>
              <Input placeholder="e.g. Rajesh Sharma" value={form.name || ""} onChange={e => updateField("name", e.target.value)} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input placeholder="e.g. 9876543210" value={form.phone || ""} onChange={e => updateField("phone", e.target.value)} />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
            </div>
            <div>
              <Label>Business Name *</Label>
              <Input placeholder="e.g. Royal Photography Studio" value={form.business_name || ""} onChange={e => updateField("business_name", e.target.value)} />
              {errors.business_name && <p className="text-sm text-destructive mt-1">{errors.business_name}</p>}
            </div>
            <div>
              <Label>Category *</Label>
              <Select onValueChange={v => updateField("category", v)}>
                <SelectTrigger><SelectValue placeholder="Select your category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
            </div>
            <div>
              <Label>City *</Label>
              <Input placeholder="e.g. Delhi, Mumbai, Jaipur" value={form.city || ""} onChange={e => updateField("city", e.target.value)} />
              {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label>Instagram Handle (optional)</Label>
              <Input placeholder="e.g. @royalphotography" value={form.instagram_handle || ""} onChange={e => updateField("instagram_handle", e.target.value)} />
            </div>
            <div>
              <Label>Additional Notes (optional)</Label>
              <Textarea placeholder="Anything specific you'd like us to highlight in your profile?" value={form.notes || ""} onChange={e => updateField("notes", e.target.value)} maxLength={500} />
            </div>

            <Button onClick={handleSubmitAndPay} disabled={isProcessing} size="lg" className="w-full mt-4 gap-2 text-lg">
              {isProcessing ? "Processing..." : "Pay ₹999 & Get Started"}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">Secure payment via Razorpay. 100% money-back guarantee if not satisfied.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorProfileSetup;
