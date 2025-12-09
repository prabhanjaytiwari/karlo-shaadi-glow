import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";

interface StoryFormData {
  couple_names: string;
  city_id: string;
  wedding_date: string;
  budget_min: number;
  budget_max: number;
  guest_count: number;
  theme: string;
  quote: string;
  story_content: string;
  cover_image_url?: string;
}

export function StorySubmissionForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<StoryFormData>();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    const { data } = await supabase.from("cities").select("id, name").eq("is_active", true);
    setCities(data || []);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('review-photos')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('review-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onSubmit = async (data: StoryFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit your story",
          variant: "destructive",
        });
        return;
      }

      let coverImageUrl = null;
      if (imageFile) {
        coverImageUrl = await uploadImage(imageFile);
        if (!coverImageUrl) {
          throw new Error("Failed to upload image");
        }
      }

      const { error } = await supabase.from("wedding_stories").insert({
        ...data,
        cover_image_url: coverImageUrl,
        submitted_by: user.id,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Story submitted!",
        description: "Your story is pending admin approval. Thank you for sharing!",
      });

      onSuccess();
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Share Your Wedding Story</h2>
        <p className="text-muted-foreground">Tell us about your special day and inspire other couples!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="couple_names">Couple Names *</Label>
          <Input
            id="couple_names"
            placeholder="Priya & Raj"
            {...register("couple_names", { required: "Required" })}
          />
          {errors.couple_names && <p className="text-sm text-red-500 mt-1">{errors.couple_names.message}</p>}
        </div>

        <div>
          <Label htmlFor="city_id">City *</Label>
          <Select onValueChange={(value) => setValue("city_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="wedding_date">Wedding Date *</Label>
          <Input
            id="wedding_date"
            type="date"
            {...register("wedding_date", { required: "Required" })}
          />
        </div>

        <div>
          <Label htmlFor="guest_count">Guest Count</Label>
          <Input
            id="guest_count"
            type="number"
            placeholder="300"
            {...register("guest_count", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="budget_min">Budget Min (₹)</Label>
          <Input
            id="budget_min"
            type="number"
            placeholder="500000"
            {...register("budget_min", { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label htmlFor="budget_max">Budget Max (₹)</Label>
          <Input
            id="budget_max"
            type="number"
            placeholder="1000000"
            {...register("budget_max", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="theme">Wedding Theme *</Label>
        <Input
          id="theme"
          placeholder="Royal Nawabi, Modern Minimalist, etc."
          {...register("theme", { required: "Required" })}
        />
      </div>

      <div>
        <Label htmlFor="quote">Your Favorite Quote *</Label>
        <Input
          id="quote"
          placeholder="A memorable quote from your wedding day"
          {...register("quote", { required: "Required" })}
        />
      </div>

      <div>
        <Label htmlFor="story_content">Your Story *</Label>
        <Textarea
          id="story_content"
          rows={6}
          placeholder="Tell us about your wedding journey, special moments, challenges overcome, and advice for other couples..."
          {...register("story_content", { required: "Required" })}
        />
      </div>

      <div>
        <Label htmlFor="cover_image">Cover Image</Label>
        <div className="mt-2">
          <Input
            id="cover_image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          <p className="text-sm text-muted-foreground mt-1">Upload a beautiful photo from your wedding</p>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Submit Story
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
