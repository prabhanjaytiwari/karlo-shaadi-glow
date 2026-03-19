import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Upload, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const portfolioSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  event_date: z.date().optional(),
  display_order: z.number().optional(),
  video_url: z.string().url().optional().or(z.literal("")),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

interface PortfolioUploadProps {
  vendorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PortfolioUpload({ vendorId, open, onOpenChange, onSuccess }: PortfolioUploadProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      description: "",
      display_order: 0,
      video_url: "",
    },
  });
  const [uploadType, setUploadType] = useState<"image" | "video">("image");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: PortfolioFormData) => {
    // For video uploads, we don't need an image file
    if (uploadType === "image" && !selectedFile) {
      toast({ title: "Please select an image", variant: "destructive" });
      return;
    }
    
    if (uploadType === "video" && !data.video_url) {
      toast({ title: "Please enter a video URL", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "/placeholder.svg";
      
      if (uploadType === "image" && selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${vendorId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("vendor-portfolio")
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("vendor-portfolio")
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;
      } else if (uploadType === "video" && data.video_url) {
        // For YouTube videos, use the thumbnail
        const youtubeMatch = data.video_url.match(
          /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
        );
        if (youtubeMatch) {
          imageUrl = `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
        }
      }

      const { error: insertError } = await supabase
        .from("vendor_portfolio")
        .insert({
          vendor_id: vendorId,
          image_url: imageUrl,
          title: data.title,
          description: data.description,
          event_date: data.event_date?.toISOString().split("T")[0],
          display_order: data.display_order,
          video_url: uploadType === "video" ? data.video_url : null,
        });

      if (insertError) throw insertError;

      toast({ title: uploadType === "video" ? "Video added successfully" : "Portfolio image uploaded successfully" });
      form.reset();
      setSelectedFile(null);
      setPreview(null);
      setUploadType("image");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error uploading", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Portfolio Image</DialogTitle>
          <DialogDescription>
            Add images to showcase your work
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Upload Type Tabs */}
            <Tabs value={uploadType} onValueChange={(v) => setUploadType(v as "image" | "video")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="image" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="video" className="gap-2">
                  <Video className="h-4 w-4" />
                  Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="mt-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {preview ? (
                    <div className="space-y-4">
                      <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                      <Button type="button" variant="outline" onClick={() => { setPreview(null); setSelectedFile(null); }}>
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
                    </label>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="video" className="mt-4">
                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (YouTube or Vimeo)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://www.youtube.com/watch?v=..." 
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Paste a YouTube or Vimeo video link
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sharma Wedding 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe this event..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value || 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || (uploadType === "image" && !selectedFile)}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {uploadType === "video" ? "Add Video" : "Upload"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
