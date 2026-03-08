import { useState } from "react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, MapPin, Award, Heart } from "lucide-react";

export default function JoinAsManager() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    experience: "",
    resume: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Manager application:", formData);
    toast({
      title: "Application Submitted!",
      description: "Our HR team will review and contact you soon.",
    });
    setFormData({ name: "", email: "", phone: "", city: "", experience: "", resume: "", message: "" });
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
            Join as Wedding Manager
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Help couples create their dream weddings while building a rewarding career.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Briefcase, label: "Flexible Hours", desc: "Work on your terms" },
            { icon: MapPin, label: "Work from Anywhere", desc: "Remote opportunities" },
            { icon: Award, label: "Competitive Pay", desc: "Performance bonuses" },
            { icon: Heart, label: "Make Memories", desc: "Create magical moments" },
          ].map((benefit, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <benefit.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <p className="font-bold mb-1">{benefit.label}</p>
              <p className="text-sm text-muted-foreground">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Apply Now</h2>
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
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="experience">Years of Experience in Event/Wedding Management *</Label>
              <Input
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                placeholder="e.g., 3 years"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="resume">Resume/LinkedIn URL</Label>
              <Input
                id="resume"
                name="resume"
                type="url"
                value={formData.resume}
                onChange={handleChange}
                placeholder="https://"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="message">Why do you want to join Karlo Shaadi? *</Label>
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
