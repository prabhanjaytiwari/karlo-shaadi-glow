import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BhindiFooter } from "@/components/BhindiFooter";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Heart, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Gift,
  Camera,
  Music,
  Users,
  Mail,
  Phone,
  Star,
  Palette,
  Wand2,
  ExternalLink,
  Download
} from "lucide-react";
import { toast } from "sonner";

// Import wedding images
import weddingCeremony from "@/assets/wedding-ceremony.jpg";
import weddingCouple1 from "@/assets/wedding-couple-1.jpg";
import weddingCoupleRomantic from "@/assets/wedding-couple-romantic.jpg";
import weddingDecoration from "@/assets/wedding-decoration.jpg";

const themes = [
  {
    id: "royal-maroon",
    name: "Royal Maroon",
    primary: "hsl(350, 70%, 35%)",
    secondary: "hsl(45, 90%, 55%)",
    gradient: "from-[#8B1538] via-[#A91D3A] to-[#C73659]",
    preview: weddingCeremony,
    badge: "Most Popular"
  },
  {
    id: "peacock-green",
    name: "Peacock Elegance",
    primary: "hsl(175, 60%, 30%)",
    secondary: "hsl(45, 85%, 50%)",
    gradient: "from-[#0D6E6E] via-[#4A9B9B] to-[#7DC8C8]",
    preview: weddingDecoration,
  },
  {
    id: "rose-gold",
    name: "Rose Gold Dreams",
    primary: "hsl(10, 50%, 60%)",
    secondary: "hsl(45, 30%, 90%)",
    gradient: "from-[#B76E79] via-[#E8B4BC] to-[#F5D5D8]",
    preview: weddingCoupleRomantic,
    badge: "Trending"
  },
  {
    id: "midnight-blue",
    name: "Midnight Royale",
    primary: "hsl(230, 60%, 25%)",
    secondary: "hsl(45, 80%, 60%)",
    gradient: "from-[#1A237E] via-[#303F9F] to-[#5C6BC0]",
    preview: weddingCouple1,
  }
];

const templates = [
  { id: "classic", name: "Classic Elegance", icon: "✨" },
  { id: "modern", name: "Modern Minimal", icon: "◇" },
  { id: "traditional", name: "Traditional Indian", icon: "🪷" },
  { id: "rustic", name: "Rustic Romance", icon: "🌿" },
];

const WeddingWebsite = () => {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[2]);
  const [formData, setFormData] = useState({
    brideName: "",
    groomName: "",
    weddingDate: "",
    venue: "",
    venueAddress: "",
    loveStory: "",
    tagline: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateWebsite = async () => {
    if (!formData.brideName || !formData.groomName || !formData.weddingDate) {
      toast.error("Please fill in the required fields");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const coupleSlug = `${formData.brideName.toLowerCase().replace(/\s+/g, '')}-weds-${formData.groomName.toLowerCase().replace(/\s+/g, '')}`;
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const url = `https://karloshaadi.com/wedding/${coupleSlug}-${uniqueId}`;
    
    setGeneratedUrl(url);
    setIsGenerating(false);
    setStep(4);
    toast.success("Your wedding website is ready! 🎉");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Create Your Wedding Website - Free with Karlo Shaadi"
        description="Design a beautiful, personalized wedding website in minutes. Share your love story, event details, and RSVP with guests. Free wedding website builder with premium templates."
        keywords="wedding website, shaadi website, wedding invitation website, free wedding website, indian wedding website builder"
      />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 px-4 py-1.5">
              <Globe className="w-3.5 h-3.5 mr-2" />
              FREE Wedding Website Builder
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Love Story
              <span className="block bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                Deserves a Beautiful Website
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create a stunning wedding website in minutes. Share your story, event details, 
              photos, and collect RSVPs — all with Karlo Shaadi branding.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: Palette, label: "Premium Themes" },
                { icon: Globe, label: "Shareable Link" },
                { icon: Users, label: "RSVP Tracking" },
                { icon: Camera, label: "Photo Gallery" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Step Progress */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: step === s ? 1.1 : 1,
                      backgroundColor: step >= s ? "hsl(var(--accent))" : "hsl(var(--muted))"
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      step >= s ? "text-accent-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </motion.div>
                  {s < 4 && (
                    <div className={`w-8 md:w-16 h-1 mx-1 rounded-full transition-colors ${
                      step > s ? "bg-accent" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs md:text-sm text-muted-foreground mt-3 px-2">
              <span className={step >= 1 ? "text-foreground font-medium" : ""}>Details</span>
              <span className={step >= 2 ? "text-foreground font-medium" : ""}>Theme</span>
              <span className={step >= 3 ? "text-foreground font-medium" : ""}>Preview</span>
              <span className={step >= 4 ? "text-foreground font-medium" : ""}>Publish</span>
            </div>
          </div>

          {/* Main Builder Card */}
          <Card className="max-w-4xl mx-auto overflow-hidden border-2 border-border/50 shadow-2xl">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold">Tell Us About Your Wedding</h2>
                      <p className="text-muted-foreground text-sm">Let's create something beautiful together</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="brideName" className="flex items-center gap-2 mb-2">
                          <span className="text-accent">👰</span> Bride's Name *
                        </Label>
                        <Input
                          id="brideName"
                          placeholder="e.g., Priya Sharma"
                          value={formData.brideName}
                          onChange={(e) => handleInputChange("brideName", e.target.value)}
                          className="h-12"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="groomName" className="flex items-center gap-2 mb-2">
                          <span className="text-accent">🤵</span> Groom's Name *
                        </Label>
                        <Input
                          id="groomName"
                          placeholder="e.g., Rahul Verma"
                          value={formData.groomName}
                          onChange={(e) => handleInputChange("groomName", e.target.value)}
                          className="h-12"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="weddingDate" className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-accent" /> Wedding Date *
                        </Label>
                        <Input
                          id="weddingDate"
                          type="date"
                          value={formData.weddingDate}
                          onChange={(e) => handleInputChange("weddingDate", e.target.value)}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="venue" className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-accent" /> Venue Name
                        </Label>
                        <Input
                          id="venue"
                          placeholder="e.g., Taj Palace Hotel"
                          value={formData.venue}
                          onChange={(e) => handleInputChange("venue", e.target.value)}
                          className="h-12"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="venueAddress" className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" /> Venue Address
                        </Label>
                        <Input
                          id="venueAddress"
                          placeholder="e.g., New Delhi, India"
                          value={formData.venueAddress}
                          onChange={(e) => handleInputChange("venueAddress", e.target.value)}
                          className="h-12"
                        />
                      </div>

                      <div>
                        <Label htmlFor="tagline" className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-accent" /> Wedding Tagline
                        </Label>
                        <Input
                          id="tagline"
                          placeholder="e.g., Two souls, one journey"
                          value={formData.tagline}
                          onChange={(e) => handleInputChange("tagline", e.target.value)}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="loveStory" className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-accent" /> Your Love Story (Optional)
                      </Label>
                      <Textarea
                        id="loveStory"
                        placeholder="Share how you met, your journey together, what makes your love special..."
                        value={formData.loveStory}
                        onChange={(e) => handleInputChange("loveStory", e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button 
                      size="lg" 
                      onClick={() => {
                        if (!formData.brideName || !formData.groomName || !formData.weddingDate) {
                          toast.error("Please fill in the required fields");
                          return;
                        }
                        setStep(2);
                      }}
                      className="gap-2"
                    >
                      Choose Theme <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Theme Selection */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold">Choose Your Theme</h2>
                      <p className="text-muted-foreground text-sm">Select colors that match your wedding vibe</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {themes.map((theme) => (
                      <motion.div
                        key={theme.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTheme(theme)}
                        className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                          selectedTheme.id === theme.id 
                            ? "border-accent shadow-lg shadow-accent/20" 
                            : "border-border/50 hover:border-accent/50"
                        }`}
                      >
                        <div className="aspect-[16/9] relative">
                          <img 
                            src={theme.preview} 
                            alt={theme.name}
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-60`} />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="font-bold text-lg">{theme.name}</h3>
                          </div>
                          {theme.badge && (
                            <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                              {theme.badge}
                            </Badge>
                          )}
                          {selectedTheme.id === theme.id && (
                            <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mb-8">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-accent" /> Template Style
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            selectedTemplate.id === template.id
                              ? "border-accent bg-accent/10"
                              : "border-border/50 hover:border-accent/50"
                          }`}
                        >
                          <span className="text-2xl mb-2 block">{template.icon}</span>
                          <span className="text-sm font-medium">{template.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button size="lg" onClick={() => setStep(3)} className="gap-2">
                      Preview Website <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preview */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold">Preview Your Website</h2>
                      <p className="text-muted-foreground text-sm">Here's how your wedding website will look</p>
                    </div>
                  </div>

                  {/* Website Preview */}
                  <div className="rounded-xl border-2 border-border overflow-hidden shadow-2xl mb-6">
                    {/* Browser Bar */}
                    <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          karloshaadi.com/wedding/{formData.brideName.toLowerCase()}-weds-{formData.groomName.toLowerCase()}
                        </div>
                      </div>
                    </div>

                    {/* Website Content Preview */}
                    <div className={`relative bg-gradient-to-br ${selectedTheme.gradient} min-h-[400px]`}>
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="relative p-8 text-center text-white">
                        {/* Decorative Elements */}
                        <div className="flex justify-center mb-4">
                          <div className="w-20 h-[1px] bg-white/50" />
                          <div className="mx-4">✦</div>
                          <div className="w-20 h-[1px] bg-white/50" />
                        </div>

                        <p className="text-white/80 text-sm uppercase tracking-[0.3em] mb-4">
                          {selectedTemplate.icon} Wedding Invitation
                        </p>

                        <h1 className="text-4xl md:text-6xl font-serif mb-4">
                          {formData.brideName || "Bride"} 
                          <span className="block text-2xl md:text-3xl my-2 font-light">&</span>
                          {formData.groomName || "Groom"}
                        </h1>

                        {formData.tagline && (
                          <p className="text-lg italic text-white/90 mb-6">"{formData.tagline}"</p>
                        )}

                        <div className="inline-flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString('en-IN', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : "Wedding Date"}</span>
                          </div>
                        </div>

                        {formData.venue && (
                          <div className="flex items-center justify-center gap-2 text-white/80 mb-6">
                            <MapPin className="w-4 h-4" />
                            <span>{formData.venue}{formData.venueAddress && `, ${formData.venueAddress}`}</span>
                          </div>
                        )}

                        <div className="flex justify-center gap-4 mt-8">
                          <Button variant="secondary" size="sm" className="gap-2">
                            <Users className="w-4 h-4" /> RSVP
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
                            <Gift className="w-4 h-4" /> Registry
                          </Button>
                        </div>

                        {/* Karlo Shaadi Branding */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                          <div className="flex items-center gap-2 text-white/60 text-xs bg-black/20 px-3 py-1 rounded-full">
                            <Heart className="w-3 h-3 fill-accent text-accent" />
                            Powered by Karlo Shaadi
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={generateWebsite}
                      disabled={isGenerating}
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-4 h-4" />
                          </motion.div>
                          Creating Magic...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" /> Publish Website
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 md:p-8 text-center"
                >
                  {/* Success Animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 100 }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Check className="w-12 h-12 text-white" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      🎉 Your Wedding Website is Live!
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Share this beautiful website with your guests
                    </p>
                  </motion.div>

                  {/* URL Display */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-muted/50 rounded-xl p-4 mb-6 max-w-xl mx-auto"
                  >
                    <Label className="text-xs text-muted-foreground mb-2 block">Your Wedding Website URL</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={generatedUrl} 
                        readOnly 
                        className="text-center font-mono text-sm bg-background"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyToClipboard}
                        className="shrink-0"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-3 mb-8"
                  >
                    <Button variant="outline" className="gap-2" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4" /> Copy Link
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="w-4 h-4" /> View Live
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" /> Download QR
                    </Button>
                  </motion.div>

                  {/* Share on WhatsApp */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button 
                      size="lg" 
                      className="bg-[#25D366] hover:bg-[#128C7E] text-white gap-2"
                      onClick={() => {
                        const message = encodeURIComponent(
                          `💍 You're Invited! 💍\n\n${formData.brideName} & ${formData.groomName} are getting married!\n\n📅 ${formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString('en-IN') : ''}\n📍 ${formData.venue || 'Venue TBA'}\n\nView our wedding website: ${generatedUrl}\n\nWith love,\n${formData.brideName} & ${formData.groomName}`
                        );
                        window.open(`https://wa.me/?text=${message}`, "_blank");
                      }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Share on WhatsApp
                    </Button>
                  </motion.div>

                  {/* Create Another */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 pt-6 border-t"
                  >
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setStep(1);
                        setFormData({
                          brideName: "",
                          groomName: "",
                          weddingDate: "",
                          venue: "",
                          venueAddress: "",
                          loveStory: "",
                          tagline: "",
                          contactEmail: "",
                          contactPhone: "",
                        });
                        setGeneratedUrl("");
                      }}
                      className="text-muted-foreground"
                    >
                      Create Another Website
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Bottom CTA for Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto mt-12 text-center"
          >
            <Card className="p-6 bg-gradient-to-br from-accent/10 via-background to-primary/10 border-accent/20">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <h3 className="font-bold">Want Premium Features?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Custom domain, remove branding, unlimited photos, guest management & more
              </p>
              <Button variant="outline" className="border-accent/50 hover:bg-accent/10">
                Upgrade to Premium
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
};

export default WeddingWebsite;
