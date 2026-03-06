import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, IndianRupee, Clock, CheckCircle2, AlertTriangle, Send, Trash2, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "@/lib/paymentUtils";

interface PaymentScheduleManagerProps {
  vendorId: string;
  vendorName: string;
}

interface Schedule {
  id: string;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  event_date: string | null;
  total_amount: number;
  service_description: string | null;
  status: string;
  created_at: string;
  milestones?: Milestone[];
}

interface Milestone {
  id: string;
  schedule_id: string;
  milestone_name: string;
  amount: number;
  due_date: string | null;
  status: string;
  paid_at: string | null;
}

const PRESET_SPLITS = [
  { label: "30 / 40 / 30", splits: [30, 40, 30], names: ["Advance", "Before Event", "After Event"] },
  { label: "50 / 50", splits: [50, 50], names: ["Advance", "Final Payment"] },
  { label: "30 / 70", splits: [30, 70], names: ["Advance", "Final Payment"] },
  { label: "100%", splits: [100], names: ["Full Payment"] },
];

export function PaymentScheduleManager({ vendorId, vendorName }: PaymentScheduleManagerProps) {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [selectedSplit, setSelectedSplit] = useState(0);

  useEffect(() => { loadSchedules(); }, [vendorId]);

  const loadSchedules = async () => {
    setLoading(true);
    const { data: schedulesData } = await supabase
      .from("payment_schedules")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (schedulesData && schedulesData.length > 0) {
      const { data: milestonesData } = await supabase
        .from("payment_schedule_milestones")
        .select("*")
        .in("schedule_id", schedulesData.map(s => s.id))
        .order("created_at", { ascending: true });

      const enriched = schedulesData.map(s => ({
        ...s,
        milestones: (milestonesData || []).filter(m => m.schedule_id === s.id)
      }));
      setSchedules(enriched);
    } else {
      setSchedules([]);
    }
    setLoading(false);
  };

  const createSchedule = async () => {
    if (!clientName || !totalAmount) {
      toast({ title: "Client name and total amount are required", variant: "destructive" });
      return;
    }

    const amount = parseFloat(totalAmount);
    const split = PRESET_SPLITS[selectedSplit];

    const { data: schedule, error } = await supabase
      .from("payment_schedules")
      .insert({
        vendor_id: vendorId,
        client_name: clientName,
        client_phone: clientPhone || null,
        client_email: clientEmail || null,
        event_date: eventDate || null,
        total_amount: amount,
        service_description: serviceDesc || null,
      })
      .select()
      .single();

    if (error || !schedule) {
      toast({ title: "Failed to create schedule", variant: "destructive" });
      return;
    }

    // Create milestones
    const milestones = split.splits.map((pct, i) => ({
      schedule_id: schedule.id,
      milestone_name: split.names[i],
      amount: Math.round((amount * pct) / 100),
      due_date: eventDate ? calculateDueDate(eventDate, i, split.splits.length) : null,
      status: "pending",
    }));

    await supabase.from("payment_schedule_milestones").insert(milestones);

    toast({ title: "Payment schedule created!" });
    setCreateOpen(false);
    resetForm();
    loadSchedules();
  };

  const calculateDueDate = (eventDate: string, index: number, total: number): string => {
    const date = new Date(eventDate);
    if (index === 0) {
      // Advance: immediate (today)
      return new Date().toISOString().split("T")[0];
    }
    if (index === total - 1) {
      // Final: 3 days after event
      date.setDate(date.getDate() + 3);
      return date.toISOString().split("T")[0];
    }
    // Middle: 7 days before event
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  };

  const markMilestonePaid = async (milestoneId: string) => {
    await supabase
      .from("payment_schedule_milestones")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", milestoneId);
    toast({ title: "Marked as paid!" });
    loadSchedules();
  };

  const sendReminder = (schedule: Schedule, milestone: Milestone) => {
    const msg = `Hi ${schedule.client_name},\n\nThis is a reminder from ${vendorName} regarding your payment:\n\n📋 ${milestone.milestone_name}\n💰 Amount: ${formatCurrency(milestone.amount)}\n📅 Due: ${milestone.due_date ? new Date(milestone.due_date).toLocaleDateString("en-IN") : "As agreed"}\n\nPlease make the payment at your earliest convenience.\n\nThank you! 🙏`;
    const phone = schedule.client_phone?.replace(/\D/g, "");
    if (phone) {
      window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    } else {
      navigator.clipboard.writeText(msg);
      toast({ title: "Message copied to clipboard!" });
    }
  };

  const resetForm = () => {
    setClientName(""); setClientPhone(""); setClientEmail("");
    setEventDate(""); setTotalAmount(""); setServiceDesc(""); setSelectedSplit(0);
  };

  const deleteSchedule = async (id: string) => {
    await supabase.from("payment_schedule_milestones").delete().eq("schedule_id", id);
    await supabase.from("payment_schedules").delete().eq("id", id);
    toast({ title: "Schedule deleted" });
    loadSchedules();
  };

  // Dashboard stats
  const totalReceivable = schedules.reduce((sum, s) => {
    const unpaid = (s.milestones || []).filter(m => m.status !== "paid").reduce((a, m) => a + Number(m.amount), 0);
    return sum + unpaid;
  }, 0);

  const totalCollected = schedules.reduce((sum, s) => {
    const paid = (s.milestones || []).filter(m => m.status === "paid").reduce((a, m) => a + Number(m.amount), 0);
    return sum + paid;
  }, 0);

  const overdueCount = schedules.reduce((count, s) => {
    return count + (s.milestones || []).filter(m => 
      m.status === "pending" && m.due_date && new Date(m.due_date) < new Date()
    ).length;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Receivable</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(totalReceivable)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Collected</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(totalCollected)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Overdue</p>
            <p className={`text-lg font-bold ${overdueCount > 0 ? "text-destructive" : "text-muted-foreground"}`}>{overdueCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Button */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" size="lg">
            <Plus className="h-4 w-4 mr-2" />
            New Payment Schedule
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Payment Schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Client Name *</Label>
              <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Priya & Rahul" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Phone</Label>
                <Input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="9876543210" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="email@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Event Date</Label>
                <Input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} />
              </div>
              <div>
                <Label>Total Amount *</Label>
                <Input type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="₹" />
              </div>
            </div>
            <div>
              <Label>Service Description</Label>
              <Textarea value={serviceDesc} onChange={e => setServiceDesc(e.target.value)} placeholder="e.g. Full day photography + album" rows={2} />
            </div>
            <div>
              <Label>Payment Split</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {PRESET_SPLITS.map((split, i) => (
                  <Button
                    key={i}
                    variant={selectedSplit === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSplit(i)}
                    className="text-xs"
                  >
                    {split.label}
                  </Button>
                ))}
              </div>
              {totalAmount && (
                <div className="mt-3 p-3 bg-muted/50 rounded-xl text-xs space-y-1">
                  {PRESET_SPLITS[selectedSplit].splits.map((pct, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{PRESET_SPLITS[selectedSplit].names[i]}</span>
                      <span className="font-semibold">{formatCurrency(Math.round((parseFloat(totalAmount) * pct) / 100))}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={createSchedule} className="w-full">Create Schedule</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedules List */}
      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : schedules.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <IndianRupee className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">No payment schedules yet</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Create one to start tracking client payments</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {schedules.map(schedule => {
            const milestones = schedule.milestones || [];
            const paidCount = milestones.filter(m => m.status === "paid").length;
            const isExpanded = expandedId === schedule.id;
            const hasOverdue = milestones.some(m => m.status === "pending" && m.due_date && new Date(m.due_date) < new Date());

            return (
              <Card key={schedule.id} className={`border-border/50 ${hasOverdue ? "border-l-4 border-l-destructive" : ""}`}>
                <div
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedId(isExpanded ? null : schedule.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold truncate">{schedule.client_name}</span>
                      <Badge variant={paidCount === milestones.length ? "default" : "secondary"} className="text-[10px] shrink-0">
                        {paidCount}/{milestones.length} paid
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(Number(schedule.total_amount))}
                      {schedule.event_date && ` • ${new Date(schedule.event_date).toLocaleDateString("en-IN")}`}
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>

                {isExpanded && (
                  <CardContent className="pt-0 space-y-3">
                    {milestones.map(milestone => {
                      const isOverdue = milestone.status === "pending" && milestone.due_date && new Date(milestone.due_date) < new Date();
                      return (
                        <div key={milestone.id} className={`flex items-center justify-between p-3 rounded-xl ${milestone.status === "paid" ? "bg-green-50 dark:bg-green-950/20" : isOverdue ? "bg-red-50 dark:bg-red-950/20" : "bg-muted/30"}`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {milestone.status === "paid" ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                              ) : isOverdue ? (
                                <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                              ) : (
                                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                              )}
                              <span className="text-sm font-medium">{milestone.milestone_name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground ml-6">
                              {formatCurrency(Number(milestone.amount))}
                              {milestone.due_date && ` • Due: ${new Date(milestone.due_date).toLocaleDateString("en-IN")}`}
                              {milestone.paid_at && ` • Paid: ${new Date(milestone.paid_at).toLocaleDateString("en-IN")}`}
                            </p>
                          </div>
                          {milestone.status !== "paid" && (
                            <div className="flex gap-1.5 shrink-0">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => sendReminder(schedule, milestone)} title="Send WhatsApp reminder">
                                <Send className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => markMilestonePaid(milestone.id)}>
                                Paid
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div className="flex justify-end pt-1">
                      <Button size="sm" variant="ghost" className="text-xs text-destructive" onClick={() => deleteSchedule(schedule.id)}>
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
