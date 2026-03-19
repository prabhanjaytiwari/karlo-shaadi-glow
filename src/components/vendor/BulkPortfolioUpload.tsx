import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ImageFile {
  file: File;
  preview: string;
  title: string;
  description: string;
}

interface BulkPortfolioUploadProps {
  vendorId: string;
  onSuccess: () => void;
}

export function BulkPortfolioUpload({ vendorId, onSuccess }: BulkPortfolioUploadProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true,
    maxSize: 10485760, // 10MB
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: ""
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  });

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const updateImageData = (index: number, field: 'title' | 'description', value: string) => {
    setImages(prev => {
      const newImages = [...prev];
      newImages[index][field] = value;
      return newImages;
    });
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      toast({
        title: "No images",
        description: "Please add at least one image to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    let successCount = 0;
    const totalImages = images.length;

    try {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const fileName = `${vendorId}/${Date.now()}-${image.file.name}`;

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("vendor-portfolio")
          .upload(fileName, image.file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("vendor-portfolio")
          .getPublicUrl(fileName);

        // Insert into database
        const { error: dbError } = await supabase
          .from("vendor_portfolio")
          .insert({
            vendor_id: vendorId,
            image_url: publicUrl,
            title: image.title,
            description: image.description,
            display_order: i
          });

        if (!dbError) {
          successCount++;
        }

        // Update progress
        setUploadProgress(((i + 1) / totalImages) * 100);
      }

      toast({
        title: "Upload complete!",
        description: `Successfully uploaded ${successCount} of ${totalImages} images.`,
      });

      // Clear images and notify parent
      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
      setUploadProgress(0);
      onSuccess();
    } catch (error: any) {
      console.error("Error uploading:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Portfolio Images</CardTitle>
          <CardDescription>Drag and drop multiple images or click to select</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop images here...</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">
                  Drag & drop images here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, JPEG, WEBP up to 10MB each
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview & Edit */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Selected Images ({images.length})</CardTitle>
                <CardDescription>Edit details for each image before uploading</CardDescription>
              </div>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload All
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Upload Progress</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <div className="grid gap-4">
              {images.map((image, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="grid md:grid-cols-[200px_1fr] gap-4 p-4">
                    {/* Image Preview */}
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={image.preview}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground hover:bg-destructive"
                        onClick={() => removeImage(index)}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Image Details */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${index}`}>Title</Label>
                        <Input
                          id={`title-${index}`}
                          value={image.title}
                          onChange={(e) => updateImageData(index, 'title', e.target.value)}
                          placeholder="Enter image title"
                          disabled={uploading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`description-${index}`}>Description (Optional)</Label>
                        <Input
                          id={`description-${index}`}
                          value={image.description}
                          onChange={(e) => updateImageData(index, 'description', e.target.value)}
                          placeholder="Describe this work..."
                          disabled={uploading}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
