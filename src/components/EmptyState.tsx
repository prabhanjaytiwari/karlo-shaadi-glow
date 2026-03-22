import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onAction
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      {(actionText && (actionLink || onAction)) && (
        <>
          {actionLink ? (
            <Link to={actionLink}>
              <Button size="lg" className="rounded-full px-8">
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button size="lg" className="rounded-full px-8" onClick={onAction}>
              {actionText}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
