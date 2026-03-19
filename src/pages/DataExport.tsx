import { useState } from "react";


import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileJson, 
  FileText, 
  Calendar, 
  Heart, 
  MessageSquare, 
  ShoppingBag,
  Shield,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

export default function DataExport() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const exportData = async (dataType: string) => {
    setLoading(dataType);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let data;
      const filename = `karlo-shaadi-${dataType}-${new Date().toISOString().split('T')[0]}`;

      switch (dataType) {
        case 'profile': {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          data = profile;
          break;
        }

        case 'bookings': {
          const { data: bookings } = await supabase
            .from('bookings')
            .select(`
              *,
              vendors (business_name, category)
            `)
            .eq('couple_id', user.id);
          data = bookings;
          break;
        }

        case 'favorites': {
          const { data: favorites } = await supabase
            .from('favorites')
            .select(`
              *,
              vendors (business_name, category, city_id)
            `)
            .eq('user_id', user.id);
          data = favorites;
          break;
        }

        case 'messages': {
          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
            .order('created_at', { ascending: false });
          data = messages;
          break;
        }

        case 'all': {
          const [profileData, bookingsData, favoritesData, messagesData] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', user.id).single(),
            supabase.from('bookings').select('*, vendors (business_name, category)').eq('couple_id', user.id),
            supabase.from('favorites').select('*, vendors (business_name, category)').eq('user_id', user.id),
            supabase.from('messages').select('*').or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          ]);

          data = {
            profile: profileData.data,
            bookings: bookingsData.data,
            favorites: favoritesData.data,
            messages: messagesData.data,
            exportedAt: new Date().toISOString()
          };
          break;
        }

        default:
          throw new Error("Invalid data type");
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful!",
        description: `Your ${dataType} data has been downloaded.`,
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const exportTypes = [
    {
      id: 'profile',
      title: 'Profile Data',
      description: 'Your personal information, wedding details, and preferences',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'bookings',
      title: 'Booking History',
      description: 'All your vendor bookings, payments, and transaction details',
      icon: ShoppingBag,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'favorites',
      title: 'Saved Vendors',
      description: 'Your favorite vendors and shortlisted services',
      icon: Heart,
      color: 'from-red-500 to-rose-500'
    },
    {
      id: 'messages',
      title: 'Message History',
      description: 'All conversations with vendors and support team',
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'all',
      title: 'Complete Data Package',
      description: 'Everything above in one comprehensive file',
      icon: FileJson,
      color: 'from-orange-500 to-amber-500',
      featured: true
    }
  ];

  return (
    <>
      <SEO 
        title="Export Your Data"
        description="Download and backup all your wedding planning data from Karlo Shaadi. Export your profile, bookings, favorites, and messages."
        keywords="data export, backup, download wedding data, karlo shaadi"
      />
      
      <div className="min-h-screen bg-background">
        
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Download className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="font-display font-bold text-4xl sm:text-5xl mb-6">
              Export Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Wedding Data</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Download all your data in JSON format. Keep backups, analyze your wedding planning journey, or migrate to other tools.
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-green-500" />
                <span>JSON Format</span>
              </div>
            </div>
          </div>
        </section>

        {/* Export Options */}
        <section className="pb-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid sm:grid-cols-2 gap-6">
              {exportTypes.map((type) => (
                <Card
                  key={type.id}
                  className={cn(
                    "p-6 border-2 hover:border-primary/30 transition-all cursor-pointer group",
                    type.featured && "sm:col-span-2 bg-gradient-to-br from-primary/5 to-accent/5"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                      type.color
                    )}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{type.title}</h3>
                        {type.featured && (
                          <Badge className="bg-primary text-primary-foreground">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {type.description}
                      </p>
                      
                      <Button
                        onClick={() => exportData(type.id)}
                        disabled={loading === type.id}
                        className="w-full sm:w-auto"
                        size={type.featured ? "lg" : "default"}
                      >
                        {loading === type.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Export {type.title}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-8">
              About Your Data Export
            </h2>
            
            <div className="space-y-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">📦 What's Included?</h3>
                <p>All data is exported in machine-readable JSON format, including timestamps, IDs, and relationships between entities.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">🔒 Is It Secure?</h3>
                <p>Yes! Data export requires authentication and only exports YOUR data. Files are generated on-demand and never stored on our servers.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">🗑️ Data Deletion</h3>
                <p>Want to delete your account? Contact our support team and we'll permanently remove all your data within 30 days.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">📧 Need Help?</h3>
                <p>If you have questions about data privacy or export, reach out to{" "}
                  <a href="/support" className="text-primary hover:underline">
                    our support team
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}