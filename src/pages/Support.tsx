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
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const handleSubmit = async (data: SupportFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: 'support@karloshaadi.com',
          subject: `Support Request: ${sanitizeInput(data.subject)}`,
          html: `
            <h2>New Support Request</h2>
            <p><strong>From:</strong> ${sanitizeInput(data.name)} (${sanitizeInput(data.email)})</p>
            <p><strong>Subject:</strong> ${sanitizeInput(data.subject)}</p>
            <p><strong>Message:</strong></p>
            <p>${sanitizeInput(data.message).replace(/\n/g, '<br>')}</p>
          `,
        },
      });

      if (error) throw error;

      await trackEvent({
        event_type: 'support_request_submitted',
        metadata: { subject: data.subject },
      });

      toast({
        title: "Message Sent!",
        description: "Our support team will get back to you within 24 hours.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Support" />
      
      <main className={isMobile ? "px-4 py-4" : "pt-24 pb-16"}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-pink-500 to-purple-600 bg-clip-text text-transparent">
              How Can We Help?
            </h1>
            <p className="text-xl text-muted-foreground">
              Get support, find answers, or reach out to our team
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-1 space-y-6">
              <Card className="animate-fade-up">
                <CardHeader>
                  <MessageCircle className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>Chat with our support team</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Chat</Button>
                </CardContent>
              </Card>

              <Card className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <Mail className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Email Support</CardTitle>
                  <CardDescription>support@karloshaadi.com</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                </CardContent>
              </Card>
            </div>

            <Card className="lg:col-span-2 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject *</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea rows={6} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Quick answers to common questions</p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">How do I book a vendor?</AccordionTrigger>
                <AccordionContent>
                  Browse vendors by category, view their profiles, and click "Book Now" to send a booking request. 
                  Vendors will respond with availability and pricing details.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">Are all vendors verified?</AccordionTrigger>
                <AccordionContent>
                  We verify vendor credentials, but couples should conduct their own research and review portfolios, 
                  ratings, and reviews before making final decisions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">How do payments work?</AccordionTrigger>
                <AccordionContent>
                  Payment terms are agreed upon directly with vendors. Most require an advance payment to confirm 
                  bookings, with the balance due closer to the wedding date.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">Can I cancel a booking?</AccordionTrigger>
                <AccordionContent>
                  Cancellation policies vary by vendor. Review the vendor's cancellation policy before booking and 
                  contact them directly through our messaging system to initiate cancellations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">How do I become a vendor?</AccordionTrigger>
                <AccordionContent>
                  Click "For Vendors" in the navigation menu and complete the registration process. You'll need to 
                  provide business details, portfolio samples, and complete verification.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">Is there a fee to use the platform?</AccordionTrigger>
                <AccordionContent>
                  Browsing and connecting with vendors is free for couples. Vendors pay a small platform fee for 
                  successful bookings to help us maintain and improve the service.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default Support;