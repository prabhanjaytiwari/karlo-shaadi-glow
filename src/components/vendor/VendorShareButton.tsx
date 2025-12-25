import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2, Copy, Check, MessageCircle, Twitter, Facebook, Linkedin } from 'lucide-react';
import { getVendorShareLink } from '@/hooks/useDeepLinks';
import { useToast } from '@/hooks/use-toast';

interface VendorShareButtonProps {
  vendorId: string;
  vendorName: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'icon';
}

export function VendorShareButton({ 
  vendorId, 
  vendorName, 
  className,
  variant = 'outline' 
}: VendorShareButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const links = getVendorShareLink(vendorId);
  const shareUrl = links.universalLink;
  const shareText = `Check out ${vendorName} on Karlo Shaadi - India's trusted wedding vendor platform!`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: 'Link copied!',
        description: 'Share this link with your friends and family',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: vendorName,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error - ignore
      }
    }
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const openShareLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  // Use native share on mobile if available
  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  if (variant === 'icon') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className={className}>
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {hasNativeShare && (
            <DropdownMenuItem onClick={handleNativeShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share...
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleCopyLink}>
            {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openShareLink(shareLinks.whatsapp)}>
            <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openShareLink(shareLinks.twitter)}>
            <Twitter className="h-4 w-4 mr-2 text-sky-500" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openShareLink(shareLinks.facebook)}>
            <Facebook className="h-4 w-4 mr-2 text-blue-600" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openShareLink(shareLinks.linkedin)}>
            <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
            LinkedIn
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant === 'default' ? 'default' : 'outline'} className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {hasNativeShare && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share...
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareLink(shareLinks.whatsapp)}>
          <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareLink(shareLinks.twitter)}>
          <Twitter className="h-4 w-4 mr-2 text-sky-500" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareLink(shareLinks.facebook)}>
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareLink(shareLinks.linkedin)}>
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
