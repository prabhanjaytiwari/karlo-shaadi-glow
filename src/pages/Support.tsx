import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Mail, HelpCircle } from "lucide-react";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supportFormSchema, sanitizeInput } from "@/lib/validation";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type SupportFormData = z.infer<typeof supportFormSchema>;

const Support = () => {
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const handleSubmit = async (data: SupportFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: 'support@karloshaadi.com',
          subject: `Support Request: ${sanitizeInput(data.subject)}`,
          html: `<h2>New Support Request</h2><p><strong>From:</strong> ${sanitizeInput(data.name)} (${sanitizeInput(data.email)})</p><p><strong>Subject:</strong> ${sanitizeInput(data.subject)}</p><p><strong>Message:</strong></p><p>${sanitizeInput(data.message).replace(/\n/g, '<br>')}</p>`,
        },
      });
      if (error) throw error;
      await trackEvent({ event_type: 'support_request_submitted', metadata: { subject: data.subject } });
      toast({ title: "Message Sent!", description: "Our support team will get back to you within 24 hours." });
      form.reset();
    } catch {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } finally { setIsSubmitting(false); }
  };

  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Support" />
      
      <main className={isMobile ? "px-4 py-4 pb-24" : "pt-24 pb-16"}>
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">How Can We Help?</h1>
            <p className="text-muted-foreground">Get support, find answers, or reach out to our team</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-2xl bg-card shadow-[var(--shadow-sm)] p-5">
                <MessageCircle className="h-7 w-7 text-primary mb-3" />
                <h3 className="font-semibold mb-1">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-3">Chat with our support team</p>
                <Button className="w-full rounded-full">Start Chat</Button>
              </div>

              <div className="rounded-2xl bg-card shadow-[var(--shadow-sm)] p-5">
                <Mail className="h-7 w-7 text-primary mb-3" />
                <h3 className="font-semibold mb-1">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-1">support@karloshaadi.com</p>
                <p className="text-xs text-muted-foreground">Response within 24 hours</p>
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl bg-card shadow-[var(--shadow-sm)] p-6">
              <h3 className="font-semibold text-lg mb-1">Send us a Message</h3>
              <p className="text-sm text-muted-foreground mb-5">Fill out the form below and we'll get back to you</p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Name *</FormLabel><FormControl><Input {...field} className="rounded-xl" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" {...field} className="rounded-xl" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem><FormLabel>Subject *</FormLabel><FormControl><Input {...field} className="rounded-xl" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem><FormLabel>Message *</FormLabel><FormControl><Input {...field} className="rounded-xl" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-1">Frequently Asked Questions</h2>
              <p className="text-sm text-muted-foreground">Quick answers to common questions</p>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {[
                { q: "How do I book a vendor?", a: "Browse vendors by category, view their profiles, and click 'Book Now' to send a booking request. Vendors will respond with availability and pricing details." },
                { q: "Are all vendors verified?", a: "We verify vendor credentials, but couples should conduct their own research and review portfolios, ratings, and reviews before making final decisions." },
                { q: "How do payments work?", a: "Payment terms are agreed upon directly with vendors. Most require an advance payment to confirm bookings, with the balance due closer to the wedding date." },
                { q: "Can I cancel a booking?", a: "Cancellation policies vary by vendor. Review the vendor's cancellation policy before booking and contact them directly through our messaging system to initiate cancellations." },
                { q: "How do I become a vendor?", a: "Click 'For Vendors' in the navigation menu and complete the registration process. You'll need to provide business details, portfolio samples, and complete verification." },
                { q: "Is there a fee to use the platform?", a: "Browsing and connecting with vendors is free for couples. Vendors pay a small platform fee for successful bookings to help us maintain and improve the service." },
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-border/30 rounded-2xl px-5 bg-card">
                  <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline py-4">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm pb-4">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;
