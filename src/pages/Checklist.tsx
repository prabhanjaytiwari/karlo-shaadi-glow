import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Plus, 
  Loader2,
  Sparkles,
  Clock,
  ListChecks,
  ChevronRight,
  Trash2,
  Edit2,
  Save
} from "lucide-react";
import { format, differenceInMonths, addMonths } from "date-fns";

interface ChecklistItem {
  id: string;
  user_id: string;
  task_name: string;
  category: string;
  months_before: number;
  is_completed: boolean;
  completed_at: string | null;
  notes: string | null;
  display_order: number;
  is_custom: boolean;
}

const DEFAULT_CHECKLIST = [
  // 12+ months before
  { task_name: "Set your wedding budget", category: "Planning", months_before: 12, display_order: 1 },
  { task_name: "Create guest list draft", category: "Planning", months_before: 12, display_order: 2 },
  { task_name: "Research and book venue", category: "Venue", months_before: 12, display_order: 3 },
  { task_name: "Start researching vendors", category: "Vendors", months_before: 12, display_order: 4 },
  { task_name: "Choose wedding date", category: "Planning", months_before: 12, display_order: 5 },
  
  // 9-11 months before
  { task_name: "Book photographer", category: "Vendors", months_before: 10, display_order: 6 },
  { task_name: "Book caterer", category: "Vendors", months_before: 10, display_order: 7 },
  { task_name: "Book decorator", category: "Vendors", months_before: 10, display_order: 8 },
  { task_name: "Book music/DJ", category: "Vendors", months_before: 10, display_order: 9 },
  { task_name: "Start shopping for wedding outfit", category: "Attire", months_before: 9, display_order: 10 },
  
  // 6-8 months before
  { task_name: "Book mehendi artist", category: "Vendors", months_before: 8, display_order: 11 },
  { task_name: "Book makeup artist", category: "Vendors", months_before: 8, display_order: 12 },
  { task_name: "Send save-the-dates", category: "Invitations", months_before: 8, display_order: 13 },
  { task_name: "Plan honeymoon destination", category: "Honeymoon", months_before: 7, display_order: 14 },
  { task_name: "Book pandit/priest", category: "Vendors", months_before: 6, display_order: 15 },
  
  // 4-5 months before
  { task_name: "Order wedding invitations", category: "Invitations", months_before: 5, display_order: 16 },
  { task_name: "Finalize guest list", category: "Planning", months_before: 5, display_order: 17 },
  { task_name: "Book wedding transport", category: "Vendors", months_before: 5, display_order: 18 },
  { task_name: "Plan sangeet performances", category: "Events", months_before: 4, display_order: 19 },
  { task_name: "Book choreographer", category: "Vendors", months_before: 4, display_order: 20 },
  
  // 2-3 months before
  { task_name: "Send wedding invitations", category: "Invitations", months_before: 3, display_order: 21 },
  { task_name: "Finalize wedding menu", category: "Catering", months_before: 3, display_order: 22 },
  { task_name: "Order wedding cake", category: "Catering", months_before: 3, display_order: 23 },
  { task_name: "Schedule makeup trial", category: "Attire", months_before: 2, display_order: 24 },
  { task_name: "Confirm all vendor bookings", category: "Vendors", months_before: 2, display_order: 25 },
  { task_name: "Book hotel rooms for guests", category: "Accommodation", months_before: 2, display_order: 26 },
  
  // 1 month before
  { task_name: "Final dress fitting", category: "Attire", months_before: 1, display_order: 27 },
  { task_name: "Prepare wedding day timeline", category: "Planning", months_before: 1, display_order: 28 },
  { task_name: "Collect RSVPs and finalize headcount", category: "Planning", months_before: 1, display_order: 29 },
  { task_name: "Arrange wedding jewelry", category: "Attire", months_before: 1, display_order: 30 },
  
  // Week before
  { task_name: "Confirm final details with all vendors", category: "Vendors", months_before: 0, display_order: 31 },
  { task_name: "Pack for honeymoon", category: "Honeymoon", months_before: 0, display_order: 32 },
  { task_name: "Prepare emergency kit", category: "Planning", months_before: 0, display_order: 33 },
  { task_name: "Distribute tips and payments", category: "Planning", months_before: 0, display_order: 34 },
  { task_name: "Relax and enjoy your special day!", category: "Planning", months_before: 0, display_order: 35 },
];

const CATEGORIES = [
  "Planning",
  "Venue",
  "Vendors",
  "Attire",
  "Invitations",
  "Catering",
  "Events",
  "Accommodation",
  "Honeymoon",
  "Other",
];

const TIMELINE_GROUPS = [
  { label: "12+ Months Before", minMonths: 12, maxMonths: 99 },
  { label: "9-11 Months Before", minMonths: 9, maxMonths: 11 },
  { label: "6-8 Months Before", minMonths: 6, maxMonths: 8 },
  { label: "4-5 Months Before", minMonths: 4, maxMonths: 5 },
  { label: "2-3 Months Before", minMonths: 2, maxMonths: 3 },
  { label: "1 Month Before", minMonths: 1, maxMonths: 1 },
  { label: "Final Week", minMonths: 0, maxMonths: 0 },
];

export default function Checklist() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTask, setNewTask] = useState({ task_name: "", category: "Other", months_before: 6, notes: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const isMobile = useIsMobile();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    await loadUserProfile(user.id);
    await loadChecklist(user.id);
  };

  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("wedding_date")
      .eq("id", userId)
      .maybeSingle();
    
    if (data?.wedding_date) {
      setWeddingDate(new Date(data.wedding_date));
    }
  };

  const loadChecklist = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("wedding_checklist_items")
        .select("*")
        .eq("user_id", userId)
        .order("display_order");

      if (error) throw error;

      if (data && data.length > 0) {
        setItems(data);
      } else {
        // Initialize with default checklist
        await initializeChecklist(userId);
      }
    } catch (error) { console.error("Error loading checklist:", error); } finally {
      setLoading(false);
    }
  };

  const initializeChecklist = async (userId: string) => {
    const defaultItems = DEFAULT_CHECKLIST.map(item => ({
      ...item,
      user_id: userId,
      is_completed: false,
      is_custom: false,
    }));

    const { data, error } = await supabase
      .from("wedding_checklist_items")
      .insert(defaultItems)
      .select();

    if (error) {
      return;
    }

    if (data) {
      setItems(data);
    }
  };

  const toggleComplete = async (item: ChecklistItem) => {
    const newCompleted = !item.is_completed;
    const { error } = await supabase
      .from("wedding_checklist_items")
      .update({
        is_completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
      })
      .eq("id", item.id);

    if (error) {
      toast({ title: "Error updating item", variant: "destructive" });
      return;
    }

    setItems(items.map(i => 
      i.id === item.id 
        ? { ...i, is_completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
        : i
    ));

    if (newCompleted) {
      toast({ title: "Task completed!", description: item.task_name });
    }
  };

  const addCustomTask = async () => {
    if (!newTask.task_name.trim() || !user) return;

    const maxOrder = Math.max(...items.map(i => i.display_order), 0);
    
    const { data, error } = await supabase
      .from("wedding_checklist_items")
      .insert({
        user_id: user.id,
        task_name: newTask.task_name,
        category: newTask.category,
        months_before: newTask.months_before,
        notes: newTask.notes || null,
        display_order: maxOrder + 1,
        is_custom: true,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error adding task", variant: "destructive" });
      return;
    }

    if (data) {
      setItems([...items, data]);
      setNewTask({ task_name: "", category: "Other", months_before: 6, notes: "" });
      setShowAddDialog(false);
      toast({ title: "Task added!" });
    }
  };

  const updateNotes = async (itemId: string) => {
    const { error } = await supabase
      .from("wedding_checklist_items")
      .update({ notes: editNotes })
      .eq("id", itemId);

    if (error) {
      toast({ title: "Error updating notes", variant: "destructive" });
      return;
    }

    setItems(items.map(i => i.id === itemId ? { ...i, notes: editNotes } : i));
    setEditingId(null);
    toast({ title: "Notes saved!" });
  };

  const deleteTask = async (itemId: string) => {
    const { error } = await supabase
      .from("wedding_checklist_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      toast({ title: "Error deleting task", variant: "destructive" });
      return;
    }

    setItems(items.filter(i => i.id !== itemId));
    toast({ title: "Task deleted" });
  };

  const getItemsByTimelineGroup = (group: typeof TIMELINE_GROUPS[0]) => {
    return items.filter(item => 
      item.months_before >= group.minMonths && item.months_before <= group.maxMonths
    );
  };

  const getGroupProgress = (group: typeof TIMELINE_GROUPS[0]) => {
    const groupItems = getItemsByTimelineGroup(group);
    if (groupItems.length === 0) return 0;
    const completed = groupItems.filter(i => i.is_completed).length;
    return Math.round((completed / groupItems.length) * 100);
  };

  const getTotalProgress = () => {
    if (items.length === 0) return 0;
    const completed = items.filter(i => i.is_completed).length;
    return Math.round((completed / items.length) * 100);
  };

  const getTimelineStatus = (monthsBefore: number) => {
    if (!weddingDate) return "neutral";
    const targetDate = addMonths(weddingDate, -monthsBefore);
    const monthsUntilTarget = differenceInMonths(targetDate, new Date());
    
    if (monthsUntilTarget < 0) return "overdue";
    if (monthsUntilTarget <= 1) return "urgent";
    return "ontime";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalProgress = getTotalProgress();
  const completedCount = items.filter(i => i.is_completed).length;

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Wedding Checklist" />

      {/* Hero Section */}
      <section className={isMobile ? "px-4 py-4" : "py-10 md:py-12 bg-muted/30 pt-24"}>
        <div className={isMobile ? "" : "container mx-auto px-4"}>
          <div className={isMobile ? "" : "max-w-4xl mx-auto"}>
            <div className={`flex ${isMobile ? 'items-center gap-4' : 'flex-col md:flex-row md:items-center md:justify-between gap-6'}`}>
              {/* Progress Ring */}
              <Card className={`bg-card border border-border/50 rounded-2xl ${isMobile ? 'p-3 shrink-0' : 'p-5 min-w-[180px]'}`}>
                <div className="text-center">
                  <div className={`relative mx-auto ${isMobile ? 'w-16 h-16 mb-1' : 'w-24 h-24 mb-3'}`}>
                    <svg className={`${isMobile ? 'w-16 h-16' : 'w-24 h-24'} transform -rotate-90`}>
                      <circle cx={isMobile ? "32" : "48"} cy={isMobile ? "32" : "48"} r={isMobile ? "26" : "40"} stroke="currentColor" strokeWidth={isMobile ? "6" : "8"} fill="none" className="text-muted/20" />
                      <circle cx={isMobile ? "32" : "48"} cy={isMobile ? "32" : "48"} r={isMobile ? "26" : "40"} stroke="currentColor" strokeWidth={isMobile ? "6" : "8"} fill="none" strokeDasharray={isMobile ? `${totalProgress * 1.63} 163` : `${totalProgress * 2.51} 251`} className="text-accent transition-all duration-500" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`font-bold ${isMobile ? 'text-base' : 'text-2xl'}`}>{totalProgress}%</span>
                    </div>
                  </div>
                  <p className={`text-muted-foreground ${isMobile ? 'text-[11px]' : 'text-sm'}`}>
                    {completedCount}/{items.length} done
                  </p>
                </div>
              </Card>

              <div className="flex-1 min-w-0">
                {!isMobile && (
                  <Badge className="bg-accent text-accent-foreground mb-4">
                    <ListChecks className="h-3 w-3 mr-1" />Wedding Checklist
                  </Badge>
                )}
                <h1 className={`font-bold ${isMobile ? 'text-lg' : 'text-3xl md:text-4xl'} mb-1`}>
                  {isMobile ? 'Wedding Checklist' : <>Your Wedding <span className="text-accent">Checklist</span></>}
                </h1>
                <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {weddingDate 
                    ? `Wedding: ${format(weddingDate, "MMM d, yyyy")}`
                    : "Set your wedding date for timeline reminders"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actions Bar */}
      <section className="py-3 border-b bg-card/50 sticky top-12 z-30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{completedCount}</span> completed
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{items.length - completedCount}</span> remaining
              </div>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Task Name</label>
                    <Input
                      value={newTask.task_name}
                      onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
                      placeholder="Enter task name..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Category</label>
                      <Select
                        value={newTask.category}
                        onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Timeline</label>
                      <Select
                        value={String(newTask.months_before)}
                        onValueChange={(value) => setNewTask({ ...newTask, months_before: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12+ months before</SelectItem>
                          <SelectItem value="9">9-11 months before</SelectItem>
                          <SelectItem value="6">6-8 months before</SelectItem>
                          <SelectItem value="4">4-5 months before</SelectItem>
                          <SelectItem value="2">2-3 months before</SelectItem>
                          <SelectItem value="1">1 month before</SelectItem>
                          <SelectItem value="0">Final week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Notes (optional)</label>
                    <Textarea
                      value={newTask.notes}
                      onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                      placeholder="Add any notes..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={addCustomTask} className="w-full">
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section className={`py-6 ${isMobile ? 'pb-24' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="multiple" defaultValue={TIMELINE_GROUPS.map((_, i) => `group-${i}`)} className="space-y-4">
              {TIMELINE_GROUPS.map((group, groupIndex) => {
                const groupItems = getItemsByTimelineGroup(group);
                const groupProgress = getGroupProgress(group);
                
                if (groupItems.length === 0) return null;
                
                return (
                  <AccordionItem 
                    key={groupIndex} 
                    value={`group-${groupIndex}`}
                    className="border border-border/50 rounded-2xl bg-card overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-accent/5">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-accent" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold">{group.label}</h3>
                            <p className="text-sm text-muted-foreground">
                              {groupItems.filter(i => i.is_completed).length} of {groupItems.length} completed
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 hidden sm:block">
                            <Progress value={groupProgress} className="h-2" />
                          </div>
                          <Badge variant={groupProgress === 100 ? "default" : "secondary"}>
                            {groupProgress}%
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-2 pt-2">
                        {groupItems.map((item) => {
                          const timelineStatus = getTimelineStatus(item.months_before);
                          return (
                            <div 
                              key={item.id}
                              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                                item.is_completed 
                                  ? "bg-accent/5" 
                                  : timelineStatus === "overdue" 
                                    ? "bg-destructive/5" 
                                    : timelineStatus === "urgent" 
                                      ? "bg-amber-50" 
                                      : "hover:bg-muted/30"
                              }`}
                            >
                              <Checkbox
                                checked={item.is_completed}
                                onCheckedChange={() => toggleComplete(item)}
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className={`font-medium ${item.is_completed ? "line-through text-muted-foreground" : ""}`}>
                                      {item.task_name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {item.category}
                                      </Badge>
                                      {item.is_custom && (
                                        <Badge variant="secondary" className="text-xs">
                                          Custom
                                        </Badge>
                                      )}
                                      {!item.is_completed && timelineStatus === "overdue" && (
                                        <Badge variant="destructive" className="text-xs">
                                          Overdue
                                        </Badge>
                                      )}
                                      {!item.is_completed && timelineStatus === "urgent" && (
                                        <Badge className="text-xs bg-accent text-accent-foreground">
                                          Due Soon
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {item.is_custom && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => deleteTask(item.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Notes Section */}
                                {editingId === item.id ? (
                                  <div className="mt-2 flex gap-2">
                                    <Input
                                      value={editNotes}
                                      onChange={(e) => setEditNotes(e.target.value)}
                                      placeholder="Add notes..."
                                      className="flex-1 h-8 text-sm"
                                    />
                                    <Button size="sm" variant="ghost" onClick={() => updateNotes(item.id)}>
                                      <Save className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : item.notes ? (
                                  <p 
                                    className="text-sm text-muted-foreground mt-2 cursor-pointer hover:text-foreground"
                                    onClick={() => { setEditingId(item.id); setEditNotes(item.notes || ""); }}
                                  >
                                    {item.notes}
                                  </p>
                                ) : (
                                  <button
                                    className="text-xs text-muted-foreground mt-2 hover:text-primary flex items-center gap-1"
                                    onClick={() => { setEditingId(item.id); setEditNotes(""); }}
                                  >
                                    <Edit2 className="h-3 w-3" />
                                    Add notes
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Celebration when complete */}
      {totalProgress === 100 && (
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-2">
                Congratulations!
              </h2>
              <p className="text-muted-foreground">
                You've completed all your wedding planning tasks. Enjoy your special day!
              </p>
            </div>
          </div>
        </section>
      )}

      
    </div>
  );
}