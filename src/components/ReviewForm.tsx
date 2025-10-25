import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Upload, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Label } from "@/components/ui/label";
import { sanitizeInput } from "@/lib/validation";

interface ReviewFormProps {
  bookingId: string;
  vendorId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ bookingId, vendorId, onSuccess }: ReviewFormProps) {
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length + selectedFiles.length > 5) {
      toast({
        title: "Too many photos",
        description: "You can upload up to 5 photos per review",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFiles([...selectedFiles, ...imageFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (userId: string): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of selectedFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('review-photos')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('review-photos')
        .getPublicUrl(fileName);
      
      urls.push(publicUrl);
    }
    
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0 || rating < 1 || rating > 5) {
      toast({
        title: "Rating required",
        description: "Please select a rating between 1-5 stars",
        variant: "destructive",
      });
      return;
    }

    const trimmedComment = comment.trim();
    if (trimmedComment && (trimmedComment.length < 20 || trimmedComment.length > 1000)) {
      toast({
        title: "Validation error",
        description: "Review must be between 20-1000 characters if provided",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload photos first if any
      const photoUrls = selectedFiles.length > 0 ? await uploadPhotos(user.id) : [];

      const { error } = await supabase.from("reviews").insert([{
        booking_id: bookingId,
        vendor_id: vendorId,
        couple_id: user.id,
        rating,
        comment: trimmedComment ? sanitizeInput(trimmedComment) : null,
        photos: photoUrls,
      }]);

      if (error) throw error;

      // Track review creation
      await trackEvent({
        event_type: 'review_created',
        vendor_id: vendorId,
        metadata: {
          rating,
          has_comment: !!comment,
          has_photos: photoUrls.length > 0,
          photo_count: photoUrls.length,
        },
      });

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      setRating(0);
      setComment("");
      setSelectedFiles([]);
      setUploadedUrls([]);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
        <CardDescription>Share your experience with this vendor</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= (hoveredRating || rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <Textarea
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="photos" className="block text-sm font-medium mb-2">
              Photos (Optional - Max 5)
            </Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  disabled={selectedFiles.length >= 5}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedFiles.length > 0 
                    ? `${selectedFiles.length} photo${selectedFiles.length > 1 ? 's' : ''} selected` 
                    : 'Add Photos'}
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                Photos help other couples see your experience
              </p>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
