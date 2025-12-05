import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Camera, 
  UtensilsCrossed, 
  Music, 
  Flower2, 
  Sparkles,
  Trophy,
  Target,
  Clock,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PlanningTask {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  link: string;
  priority: "high" | "medium" | "low";
}

const planningTasks: PlanningTask[] = [
  {
    id: "venue",
    title: "Book Your Venue",
    description: "Find and book the perfect wedding venue",
    category: "Venue",
    icon: Target,
    link: "/search?category=venues",
    priority: "high"
  },
  {
    id: "photographer",
    title: "Hire a Photographer",
    description: "Capture your special moments forever",
    category: "Photography",
    icon: Camera,
    link: "/search?category=photography",
    priority: "high"
  },
  {
    id: "catering",
    title: "Book Catering Services",
    description: "Delicious food for your guests",
    category: "Catering",
    icon: UtensilsCrossed,
    link: "/search?category=catering",
    priority: "high"
  },
  {
    id: "decoration",
    title: "Arrange Decorations",
    description: "Make your venue look stunning",
    category: "Decoration",
    icon: Flower2,
    link: "/search?category=decoration",
    priority: "medium"
  },
  {
    id: "music",
    title: "Book DJ/Music",
    description: "Entertainment for your celebrations",
    category: "Music",
    icon: Music,
    link: "/search?category=music",
    priority: "medium"
  },
  {
    id: "mehendi",
    title: "Book Mehendi Artist",
    description: "Beautiful henna designs for bride",
    category: "Mehendi",
    icon: Sparkles,
    link: "/search?category=mehendi",
    priority: "medium"
  }
];

interface WeddingPlanningProgressProps {
  userId: string;
  weddingDate?: string;
}

export const WeddingPlanningProgress = ({ userId, weddingDate }: WeddingPlanningProgressProps) => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedTasks();
  }, [userId]);

  const fetchCompletedTasks = async () => {
    try {
      // Get user's bookings to determine completed tasks
      const { data: bookings } = await supabase
        .from("bookings")
        .select(`
          id,
          vendor_id,
          vendors (
            category
          )
        `)
        .eq("couple_id", userId)
        .in("status", ["pending", "confirmed", "in_progress", "completed"]);

      if (bookings) {
        const bookedCategories = bookings.map((b: any) => b.vendors?.category).filter(Boolean);
        const completed: string[] = [];
        
        // Map booked categories to task IDs
        if (bookedCategories.includes("venues")) completed.push("venue");
        if (bookedCategories.includes("photography")) completed.push("photographer");
        if (bookedCategories.includes("catering")) completed.push("catering");
        if (bookedCategories.includes("decoration")) completed.push("decoration");
        if (bookedCategories.includes("music")) completed.push("music");
        if (bookedCategories.includes("mehendi")) completed.push("mehendi");
        
        setCompletedTasks(completed);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.round((completedTasks.length / planningTasks.length) * 100);
  
  // Calculate days until wedding
  const daysUntilWedding = weddingDate 
    ? Math.max(0, Math.ceil((new Date(weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  const getProgressMessage = () => {
    if (progress === 100) return "Amazing! You're all set for your big day! 🎉";
    if (progress >= 75) return "Almost there! Just a few more vendors to book.";
    if (progress >= 50) return "Great progress! You're halfway through.";
    if (progress >= 25) return "Good start! Keep the momentum going.";
    return "Let's get started with your wedding planning!";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-green-500/10 text-green-500 border-green-500/20";
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-muted rounded w-full mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 overflow-hidden">
      {/* Header with Progress */}
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Wedding Planning Progress
          </CardTitle>
          {daysUntilWedding !== null && (
            <Badge variant="outline" className="bg-accent/10 border-accent/20">
              <Clock className="h-3 w-3 mr-1" />
              {daysUntilWedding} days to go
            </Badge>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{getProgressMessage()}</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedTasks.length} of {planningTasks.length} tasks completed</span>
            {progress === 100 && <span className="text-green-500 font-medium">🏆 All done!</span>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Task Checklist */}
        <div className="space-y-3">
          {planningTasks.map((task) => {
            const isCompleted = completedTasks.includes(task.id);
            const TaskIcon = task.icon;
            
            return (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 cursor-pointer group ${
                  isCompleted 
                    ? "bg-green-500/5 border-green-500/20" 
                    : "bg-card hover:bg-accent/5 border-border hover:border-primary/20"
                }`}
                onClick={() => !isCompleted && navigate(task.link)}
              >
                {/* Checkbox */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isCompleted 
                    ? "bg-green-500 text-white" 
                    : "bg-muted group-hover:bg-primary/10"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  )}
                </div>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <TaskIcon className={`h-4 w-4 ${isCompleted ? "text-green-500" : "text-primary"}`} />
                    <span className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </span>
                    {!isCompleted && (
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                </div>

                {/* Action */}
                {!isCompleted && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                )}
                {isCompleted && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                    Booked
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {progress < 100 && (
          <Button 
            className="w-full mt-6" 
            variant="premium"
            onClick={() => navigate("/search")}
          >
            Continue Planning
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
