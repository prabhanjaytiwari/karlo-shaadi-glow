import { Heart } from "lucide-react";

export const ShaadiSevaWidget = () => {
  const embedCode = `<a href="https://karloshaadi.com/shaadi-seva" target="_blank" style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:linear-gradient(135deg,#e11d48,#f59e0b);color:white;border-radius:999px;font-family:sans-serif;font-size:14px;text-decoration:none;">❤️ This wedding supports Shaadi Seva</a>`;

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 text-center">
        <a
          href="/shaadi-seva"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Heart className="h-4 w-4 fill-white" />
          This wedding supports Shaadi Seva
        </a>
        <p className="text-xs text-muted-foreground mt-3">
          Add this badge to your wedding website
        </p>
      </div>
      <div className="p-4 rounded-xl bg-muted/50 border">
        <p className="text-xs font-medium mb-2">Embed Code:</p>
        <code className="block text-[10px] p-3 rounded-lg bg-background border overflow-x-auto whitespace-pre-wrap break-all">
          {embedCode}
        </code>
      </div>
    </div>
  );
};
