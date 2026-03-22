import { useState } from "react";

import { ShaadiSevaCounter } from "@/components/ShaadiSevaCounter";
import { ShaadiSevaWidget } from "@/components/ShaadiSevaWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowRight, Users, HandHeart, Sparkles, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { CinematicImage } from "@/components/CinematicImage";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import heroSevaImg from "@/assets/hero-shaadi-seva.jpg";

export default function ShaadiSeva() {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    applicant_name: "",
    phone: "",
    city: "",
    situation: "",
    wedding_date: "",
    estimated_need: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicant_name || !formData.phone || !formData.city || !formData.situation) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("shaadi_seva_applications").insert({
        applicant_name: formData.applicant_name.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        situation: formData.situation.trim(),
        wedding_date: formData.wedding_date || null,
        estimated_need: formData.estimated_need ? Number(formData.estimated_need) : null,
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success("Application submitted successfully! We'll reach out soon.");
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Shaadi Seva - Every Wedding Helps Someone Get Married"
        description="10% of every payment on Karlo Shaadi goes to Shaadi Seva Fund, helping financially disadvantaged couples and supporting Saamuhik Vivaah events."
      />

      <MobilePageHeader title="Shaadi Seva" />

      <main className={`flex-1 ${isMobile ? '' : 'pt-20'}`}>
        {/* Hero Section with Cinematic Image */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <CinematicImage src={heroSevaImg} alt="Saamuhik Vivaah community wedding" className="w-full h-full" cinematic />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10 py-12 sm:py-20">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Heart className="h-4 w-4 text-primary fill-primary" />
                <span className="text-primary text-sm font-semibold">Shaadi Seva</span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl leading-tight">
                Your Wedding Helps<br />
                <span className="text-primary">
                  Someone Else Get Married
                </span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
                Every payment on Karlo Shaadi automatically contributes 10% to the Shaadi Seva Fund — supporting couples who can't afford their wedding.
              </p>
              <ShaadiSevaCounter />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="font-display font-bold text-xl sm:text-3xl text-center mb-8">
              How <span className="text-primary">Shaadi Seva</span> Works
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Sparkles, title: "You Book a Vendor", desc: "Plan your dream wedding on Karlo Shaadi with verified vendors" },
                { icon: Heart, title: "10% Goes to Seva", desc: "Every payment automatically earmarks 10% for the Shaadi Seva Fund" },
                { icon: HandHeart, title: "A Couple Gets Help", desc: "The fund supports financially disadvantaged couples and mass wedding events" },
              ].map((step, i) => (
                <div key={i} className="text-center p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mx-auto mb-3">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base mb-1.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                  {i < 2 && <ArrowRight className="h-5 w-5 text-accent mx-auto mt-3 hidden sm:block" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Saamuhik Vivaah Section */}
        <section className="py-10 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                    <span className="text-accent text-xs font-semibold">Saamuhik Vivaah</span>
                  </div>
                  <h2 className="font-display font-bold text-xl sm:text-3xl">
                    Mass Weddings for <span className="text-accent">Those in Need</span>
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Saamuhik Vivaah (mass wedding) is a sacred Indian tradition where multiple couples get married together, 
                    significantly reducing costs and making weddings accessible to all.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Complete wedding ceremony with rituals",
                      "Clothing, jewelry, and essentials provided",
                      "Community celebration with food and music",
                      "Legal documentation and registration support",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 p-6 border border-accent/20">
                  <Users className="h-10 w-10 text-accent mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Partner With Us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Are you an NGO, trust, or community organization interested in organizing Saamuhik Vivaah? 
                    Let's collaborate to help more couples.
                  </p>
                  <a href="mailto:seva@karloshaadi.com">
                    <Button variant="outline" className="rounded-full text-sm">
                      Contact Us <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="font-display font-bold text-xl sm:text-3xl mb-2">
                  Apply for <span className="text-primary">Financial Support</span>
                </h2>
                <p className="text-muted-foreground text-sm">
                  If you or someone you know needs financial help for their wedding, fill out this form.
                </p>
              </div>

              {submitted ? (
                <div className="text-center p-8 rounded-2xl border border-border/50 bg-card">
                  <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Application Submitted!</h3>
                  <p className="text-muted-foreground text-sm">
                    Thank you for reaching out. Our team will review your application and contact you within 48 hours.
                  </p>
                </div>
              ) : (
                <Card className="rounded-2xl border-border/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Heart className="h-5 w-5 text-primary" />
                      Support Application
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Full Name *</label>
                          <Input value={formData.applicant_name} onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })} placeholder="Your full name" maxLength={100} required />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Phone *</label>
                          <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" maxLength={15} required />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">City *</label>
                          <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Your city" maxLength={50} required />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Wedding Date</label>
                          <Input type="date" value={formData.wedding_date} onChange={(e) => setFormData({ ...formData, wedding_date: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Estimated Financial Need (₹)</label>
                        <Input type="number" value={formData.estimated_need} onChange={(e) => setFormData({ ...formData, estimated_need: e.target.value })} placeholder="e.g. 50000" min={0} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Tell Us Your Situation *</label>
                        <Textarea value={formData.situation} onChange={(e) => setFormData({ ...formData, situation: e.target.value })} placeholder="Briefly describe your situation and why you need support..." rows={4} maxLength={1000} required />
                      </div>
                      <Button type="submit" className="w-full rounded-full" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Application"}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Your information is kept confidential and used only for processing your application.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Embed Widget Section */}
        <section className={`py-10 md:py-16 bg-muted/30 ${isMobile ? 'pb-24' : ''}`}>
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="font-display font-bold text-xl mb-2">
                Add Shaadi Seva to <span className="text-accent">Your Wedding Website</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                Show your guests that your wedding is making a difference
              </p>
              <ShaadiSevaWidget />
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
}
