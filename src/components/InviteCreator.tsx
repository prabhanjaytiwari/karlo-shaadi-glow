import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Download, 
  Share2, 
  Loader2, 
  Palette,
  Heart,
  Calendar,
  MapPin,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const INVITE_STYLES = [
  { id: "traditional", label: "Traditional", description: "Classic Indian motifs with marigolds & diyas", emoji: "🪔" },
  { id: "royal", label: "Royal Rajasthani", description: "Ornate palace-inspired with gold accents", emoji: "👑" },
  { id: "modern", label: "Modern Minimal", description: "Clean, contemporary design", emoji: "✨" },
  { id: "floral", label: "Floral Garden", description: "Lush flowers and botanical elements", emoji: "🌸" },
  { id: "mandala", label: "Mandala Art", description: "Intricate mandala patterns", emoji: "🔮" },
  { id: "watercolor", label: "Watercolor", description: "Soft, artistic watercolor style", emoji: "🎨" },
];

const COLOR_THEMES = [
  { id: "maroon-gold", label: "Maroon & Gold", colors: ["#800020", "#FFD700"] },
  { id: "pink-rose", label: "Blush Pink", colors: ["#FFB6C1", "#FF69B4"] },
  { id: "blue-silver", label: "Royal Blue", colors: ["#1E3A8A", "#C0C0C0"] },
  { id: "green-gold", label: "Emerald & Gold", colors: ["#065F46", "#FFD700"] },
  { id: "purple-lavender", label: "Purple Elegance", colors: ["#7C3AED", "#E9D5FF"] },
  { id: "red-cream", label: "Auspicious Red", colors: ["#DC2626", "#FFFDD0"] },
];

interface InviteFormData {
  brideName: string;
  groomName: string;
  weddingDate: string;
  venue: string;
  city: string;
  time: string;
  familyNames: string;
  customMessage: string;
  style: string;
  colorTheme: string;
}

const InviteCreator = () => {
  const [formData, setFormData] = useState<InviteFormData>({
    brideName: "",
    groomName: "",
    weddingDate: "",
    venue: "",
    city: "",
    time: "",
    familyNames: "",
    customMessage: "",
    style: "traditional",
    colorTheme: "maroon-gold",
  });
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const handleInputChange = (field: keyof InviteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateInvite = async () => {
    if (!formData.brideName || !formData.groomName || !formData.weddingDate) {
      toast.error("Please fill in bride name, groom name, and wedding date");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const selectedStyle = INVITE_STYLES.find(s => s.id === formData.style);
      const selectedColor = COLOR_THEMES.find(c => c.id === formData.colorTheme);
      
      const formattedDate = formData.weddingDate 
        ? new Date(formData.weddingDate).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric", 
            month: "long",
            year: "numeric"
          })
        : "";

      const prompt = `Create a beautiful Indian wedding invitation card with the following specifications:

STYLE: ${selectedStyle?.label} - ${selectedStyle?.description}
COLOR THEME: ${selectedColor?.label} (Primary: ${selectedColor?.colors[0]}, Accent: ${selectedColor?.colors[1]})

CONTENT TO DISPLAY (arrange elegantly):
- Header: "Wedding Invitation" or "Shubh Vivah" in decorative text
- Couple Names: "${formData.groomName}" & "${formData.brideName}" in elegant script font
- Date: "${formattedDate}"
${formData.time ? `- Time: "${formData.time}"` : ""}
${formData.venue ? `- Venue: "${formData.venue}"` : ""}
${formData.city ? `- City: "${formData.city}"` : ""}
${formData.familyNames ? `- Family: "${formData.familyNames}"` : ""}
${formData.customMessage ? `- Message: "${formData.customMessage}"` : ""}

DESIGN REQUIREMENTS:
- Dimensions: Portrait orientation (suitable for WhatsApp/Instagram sharing)
- Include traditional Indian wedding elements like paisley, lotus, elephants, or mandala patterns
- Use decorative borders and elegant typography
- Make it visually stunning and share-worthy
- Text should be clearly readable
- Add subtle golden or decorative accents
- Include auspicious symbols like Ganesha silhouette, om, or kalash if traditional style

Make it look like a professional digital wedding invitation card.`;

      const { data, error } = await supabase.functions.invoke("generate-invite-image", {
        body: { prompt },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("Invitation created successfully!");
      } else {
        throw new Error("No image generated");
      }
    } catch (error) {
      console.error("Error generating invite:", error);
      toast.error("Failed to generate invitation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `wedding-invite-${formData.groomName}-${formData.brideName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Invitation downloaded!");
  };

  const handleWhatsAppShare = () => {
    if (!generatedImage) return;
    
    const message = `💒 You're Invited! 💒

${formData.groomName} & ${formData.brideName}
are getting married!

📅 ${formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
${formData.venue ? `📍 ${formData.venue}` : ""}
${formData.city ? `🏙️ ${formData.city}` : ""}

We would be honored by your presence!

📲 Create your FREE invite at:
${window.location.origin}/invite-creator

Made with 💕 on Karlo Shaadi`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background py-8 px-4 relative overflow-hidden">
      {/* Decorative background orbs */}
      <div className="absolute -z-10 top-20 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-accent/30 to-primary/20" />
      <div className="absolute -z-10 bottom-20 -right-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 bg-gradient-to-tl from-primary/30 to-accent/20" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Wedding Invite Creator
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Create stunning digital wedding invitations in seconds with AI. Free to use, easy to share!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-2 mb-6">
                    <TabsTrigger value="details" className="gap-2">
                      <Heart className="h-4 w-4" />
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="style" className="gap-2">
                      <Palette className="h-4 w-4" />
                      Style
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    {/* Names */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="groomName">Groom's Name *</Label>
                        <Input
                          id="groomName"
                          placeholder="e.g., Raj"
                          value={formData.groomName}
                          onChange={(e) => handleInputChange("groomName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="brideName">Bride's Name *</Label>
                        <Input
                          id="brideName"
                          placeholder="e.g., Priya"
                          value={formData.brideName}
                          onChange={(e) => handleInputChange("brideName", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weddingDate">Wedding Date *</Label>
                        <Input
                          id="weddingDate"
                          type="date"
                          value={formData.weddingDate}
                          onChange={(e) => handleInputChange("weddingDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          placeholder="e.g., 7:00 PM onwards"
                          value={formData.time}
                          onChange={(e) => handleInputChange("time", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Venue */}
                    <div>
                      <Label htmlFor="venue">Venue Name</Label>
                      <Input
                        id="venue"
                        placeholder="e.g., Grand Hyatt"
                        value={formData.venue}
                        onChange={(e) => handleInputChange("venue", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="e.g., Mumbai"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                      />
                    </div>

                    {/* Family Names */}
                    <div>
                      <Label htmlFor="familyNames">Family Names (optional)</Label>
                      <Input
                        id="familyNames"
                        placeholder="e.g., Sharma & Verma Families"
                        value={formData.familyNames}
                        onChange={(e) => handleInputChange("familyNames", e.target.value)}
                      />
                    </div>

                    {/* Custom Message */}
                    <div>
                      <Label htmlFor="customMessage">Custom Message (optional)</Label>
                      <Textarea
                        id="customMessage"
                        placeholder="e.g., Together with our families, we invite you to celebrate..."
                        value={formData.customMessage}
                        onChange={(e) => handleInputChange("customMessage", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="space-y-6">
                    {/* Style Selection */}
                    <div>
                      <Label className="mb-3 block">Invitation Style</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {INVITE_STYLES.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => handleInputChange("style", style.id)}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${
                              formData.style === style.id
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl">{style.emoji}</span>
                              <span className="font-medium text-sm">{style.label}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{style.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Theme */}
                    <div>
                      <Label className="mb-3 block">Color Theme</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {COLOR_THEMES.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => handleInputChange("colorTheme", theme.id)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              formData.colorTheme === theme.id
                                ? "border-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex gap-1 mb-2">
                              {theme.colors.map((color) => (
                                <div
                                  key={color}
                                  className="w-6 h-6 rounded-full border"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium">{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Generate Button */}
                <Button
                  onClick={generateInvite}
                  disabled={isGenerating || !formData.brideName || !formData.groomName || !formData.weddingDate}
                  className="w-full mt-6 gap-2"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Invitation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-[var(--shadow-sm)] h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Preview</h3>
                  {generatedImage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={generateInvite}
                      className="gap-1"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </Button>
                  )}
                </div>

                <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg min-h-[400px] relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                      >
                        <div className="relative w-24 h-24 mx-auto mb-4">
                          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                        </div>
                        <p className="text-muted-foreground">AI is crafting your invitation...</p>
                        <p className="text-xs text-muted-foreground mt-1">This may take 10-20 seconds</p>
                      </motion.div>
                    ) : generatedImage ? (
                      <motion.img
                        key="image"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        src={generatedImage}
                        alt="Generated wedding invitation"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                      />
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center p-8"
                      >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                          <Heart className="h-10 w-10 text-primary/50" />
                        </div>
                        <p className="text-muted-foreground">
                          Fill in the details and click "Generate" to create your invitation
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                {generatedImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 mt-4"
                  >
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="flex-1 gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      onClick={handleWhatsAppShare}
                      className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Share2 className="h-4 w-4" />
                      Share on WhatsApp
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-accent/5 rounded-lg border border-accent/20"
        >
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            💡 Tips for the Perfect Invite
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 grid md:grid-cols-2 gap-x-8">
            <li>• Keep names short and simple for better readability</li>
            <li>• Traditional style works best for religious ceremonies</li>
            <li>• Modern minimal is perfect for reception invites</li>
            <li>• Regenerate multiple times to get different variations</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default InviteCreator;
