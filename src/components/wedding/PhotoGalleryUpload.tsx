import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Camera, 
  Sparkles,
  Loader2,
  Star,
  GripVertical
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
  file?: File;
  isUploading?: boolean;
}

interface PhotoGalleryUploadProps {
  websiteId?: string;
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  coverImage: string;
  onCoverChange: (url: string) => void;
  maxImages?: number;
}

export const PhotoGalleryUpload = ({
  websiteId,
  images,
  onChange,
  coverImage,
  onCoverChange,
  maxImages = 10,
}: PhotoGalleryUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const uploadToStorage = async (file: File, folder: string = "gallery"): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("wedding-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("wedding-images")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onDropGallery = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const newImages: GalleryImage[] = [];

    for (const file of acceptedFiles) {
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      // Add placeholder immediately
      const placeholder: GalleryImage = {
        id: tempId,
        image_url: URL.createObjectURL(file),
        caption: "",
        sort_order: images.length + newImages.length,
        file,
        isUploading: true,
      };
      newImages.push(placeholder);
    }

    // Update UI with placeholders
    onChange([...images, ...newImages]);

    // Upload files
    const uploadedImages: GalleryImage[] = [];
    for (let i = 0; i < newImages.length; i++) {
      const img = newImages[i];
      if (img.file) {
        const url = await uploadToStorage(img.file);
        if (url) {
          uploadedImages.push({
            ...img,
            image_url: url,
            file: undefined,
            isUploading: false,
          });
        }
      }
    }

    // Replace placeholders with uploaded images
    const finalImages = [...images];
    for (const uploaded of uploadedImages) {
      const tempImg = newImages.find(n => n.id === uploaded.id);
      if (tempImg) {
        finalImages.push(uploaded);
      }
    }

    onChange(finalImages.filter(img => !img.isUploading || uploadedImages.some(u => u.id === img.id)));
    setUploading(false);
    toast.success(`${uploadedImages.length} image(s) uploaded`);
  }, [images, onChange, maxImages]);

  const onDropCover = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploadingCover(true);
    const file = acceptedFiles[0];
    const url = await uploadToStorage(file, "covers");
    
    if (url) {
      onCoverChange(url);
      toast.success("Cover photo uploaded!");
    } else {
      toast.error("Failed to upload cover photo");
    }
    setUploadingCover(false);
  }, [onCoverChange]);

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
    onDrop: onDropCover,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const { getRootProps: getGalleryRootProps, getInputProps: getGalleryInputProps, isDragActive: isGalleryDragActive } = useDropzone({
    onDrop: onDropGallery,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: maxImages - images.length,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: images.length >= maxImages,
  });

  const removeImage = (id: string) => {
    onChange(images.filter(img => img.id !== id).map((img, i) => ({ ...img, sort_order: i })));
  };

  const updateCaption = (id: string, caption: string) => {
    onChange(images.map(img => img.id === id ? { ...img, caption } : img));
  };

  const setAsCover = (url: string) => {
    onCoverChange(url);
    toast.success("Cover photo updated!");
  };

  return (
    <div className="space-y-6">
      {/* Cover Photo Upload */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Camera className="w-5 h-5 text-accent" />
              Cover Photo
            </h3>
            <p className="text-sm text-muted-foreground">This will be the main image on your wedding website</p>
          </div>
        </div>

        <div
          {...getCoverRootProps()}
          className={`relative cursor-pointer border-2 border-dashed rounded-xl overflow-hidden transition-all ${
            isCoverDragActive 
              ? "border-accent bg-accent/5" 
              : coverImage 
                ? "border-transparent" 
                : "border-border hover:border-accent/50"
          }`}
        >
          <input {...getCoverInputProps()} />
          
          {coverImage ? (
            <div className="relative aspect-video">
              <img 
                src={coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-white text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  Cover Photo
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Change
                </Button>
              </div>
              {uploadingCover && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center p-8">
              {uploadingCover ? (
                <Loader2 className="w-10 h-10 text-accent animate-spin mb-3" />
              ) : (
                <Camera className="w-10 h-10 text-muted-foreground mb-3" />
              )}
              <p className="font-medium">
                {isCoverDragActive ? "Drop your cover photo here" : "Drag & drop or click to upload"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-accent" />
              Photo Gallery
            </h3>
            <p className="text-sm text-muted-foreground">
              Add up to {maxImages} photos • {images.length}/{maxImages} uploaded
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
                >
                  <img 
                    src={image.image_url} 
                    alt={image.caption || `Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {image.isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => setAsCover(image.image_url)}
                        title="Set as cover"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => removeImage(image.id)}
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Order Badge */}
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Upload Drop Zone */}
        {images.length < maxImages && (
          <div
            {...getGalleryRootProps()}
            className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              isGalleryDragActive 
                ? "border-accent bg-accent/5" 
                : "border-border hover:border-accent/50"
            }`}
          >
            <input {...getGalleryInputProps()} />
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-accent animate-spin mb-2" />
                <p className="text-sm text-muted-foreground">Uploading photos...</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="font-medium">
                  {isGalleryDragActive ? "Drop photos here" : "Drag & drop photos or click to upload"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Up to {maxImages - images.length} more photos • PNG, JPG up to 5MB each
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Tips */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Photo Tips</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Use high-quality, well-lit photos for best results</li>
              <li>• Include pre-wedding, couple, and family photos</li>
              <li>• Click the star icon on any photo to set it as cover</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
