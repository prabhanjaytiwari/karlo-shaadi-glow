import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Plus,
  Search,
  Check,
  X,
  HelpCircle,
  Utensils,
  Mail,
  Phone,
  Loader2,
  Trash2,
  Edit,
  Download,
  Upload,
} from "lucide-react";

interface Guest {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  category: string;
  relation: string | null;
  rsvp_status: string;
  plus_ones: number;
  food_preference: string | null;
  dietary_notes: string | null;
  table_number: number | null;
  events: string[];
  notes: string | null;
  invitation_sent: boolean;
}

const CATEGORIES = [
  { value: "family_bride", label: "Bride's Family", color: "bg-rose-100 text-rose-700 border-rose-200" },
  { value: "family_groom", label: "Groom's Family", color: "bg-sky-100 text-sky-700 border-sky-200" },
  { value: "friends", label: "Friends", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "work", label: "Work", color: "bg-violet-100 text-violet-700 border-violet-200" },
  { value: "other", label: "Other", color: "bg-muted text-muted-foreground" },
];

const RSVP_STATUSES = [
  { value: "pending", label: "Pending", icon: HelpCircle, color: "text-amber-600" },
  { value: "confirmed", label: "Confirmed", icon: Check, color: "text-emerald-600" },
  { value: "declined", label: "Declined", icon: X, color: "text-destructive" },
  { value: "maybe", label: "Maybe", icon: HelpCircle, color: "text-muted-foreground" },
];

const FOOD_PREFERENCES = [
  { value: "veg", label: "Vegetarian" },
  { value: "non_veg", label: "Non-Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "jain", label: "Jain" },
  { value: "halal", label: "Halal" },
  { value: "no_preference", label: "No Preference" },
];

export default function GuestList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRsvp, setFilterRsvp] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "friends",
    relation: "",
    plus_ones: 0,
    food_preference: "no_preference",
    dietary_notes: "",
    table_number: "",
    events: [] as string[],
    notes: "",
  });

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    loadGuests();
  };

  const loadGuests = async () => {
    try {
      const { data, error } = await supabase
        .from("guest_list")
        .select("*")
        .order("name");

      if (error) throw error;
      setGuests(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading guests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const guestData = {
        user_id: user.id,
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        category: formData.category,
        relation: formData.relation || null,
        plus_ones: formData.plus_ones,
        food_preference: formData.food_preference,
        dietary_notes: formData.dietary_notes || null,
        table_number: formData.table_number ? parseInt(formData.table_number) : null,
        events: formData.events,
        notes: formData.notes || null,
      };

      if (editingGuest) {
        const { error } = await supabase
          .from("guest_list")
          .update(guestData)
          .eq("id", editingGuest.id);
        if (error) throw error;
        toast({ title: "Guest updated successfully" });
      } else {
        const { error } = await supabase
          .from("guest_list")
          .insert(guestData);
        if (error) throw error;
        toast({ title: "Guest added successfully" });
      }

      resetForm();
      loadGuests();
    } catch (error: any) {
      toast({
        title: "Error saving guest",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("guest_list")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Guest removed" });
      loadGuests();
    } catch (error: any) {
      toast({
        title: "Error removing guest",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateRsvpStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("guest_list")
        .update({ 
          rsvp_status: status,
          rsvp_responded_at: status !== "pending" ? new Date().toISOString() : null
        })
        .eq("id", id);
      if (error) throw error;
      loadGuests();
    } catch (error: any) {
      toast({
        title: "Error updating RSVP",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      category: "friends",
      relation: "",
      plus_ones: 0,
      food_preference: "no_preference",
      dietary_notes: "",
      table_number: "",
      events: [],
      notes: "",
    });
    setEditingGuest(null);
    setIsAddDialogOpen(false);
  };

  const openEditDialog = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      email: guest.email || "",
      phone: guest.phone || "",
      category: guest.category,
      relation: guest.relation || "",
      plus_ones: guest.plus_ones,
      food_preference: guest.food_preference || "no_preference",
      dietary_notes: guest.dietary_notes || "",
      table_number: guest.table_number?.toString() || "",
      events: guest.events || [],
      notes: guest.notes || "",
    });
    setIsAddDialogOpen(true);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Category", "RSVP", "Plus Ones", "Food Preference", "Table"];
    const rows = guests.map(g => [
      g.name,
      g.email || "",
      g.phone || "",
      g.category,
      g.rsvp_status,
      g.plus_ones.toString(),
      g.food_preference || "",
      g.table_number?.toString() || ""
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guest_list.csv";
    a.click();
  };

  // Filter guests
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone?.includes(searchQuery);
    const matchesCategory = filterCategory === "all" || guest.category === filterCategory;
    const matchesRsvp = filterRsvp === "all" || guest.rsvp_status === filterRsvp;
    return matchesSearch && matchesCategory && matchesRsvp;
  });

  // Stats
  const totalGuests = guests.reduce((sum, g) => sum + 1 + g.plus_ones, 0);
  const confirmedGuests = guests
    .filter(g => g.rsvp_status === "confirmed")
    .reduce((sum, g) => sum + 1 + g.plus_ones, 0);
  const pendingGuests = guests
    .filter(g => g.rsvp_status === "pending")
    .reduce((sum, g) => sum + 1 + g.plus_ones, 0);
  const vegCount = guests.filter(g => g.food_preference === "veg" && g.rsvp_status === "confirmed").length;
  const nonVegCount = guests.filter(g => g.food_preference === "non_veg" && g.rsvp_status === "confirmed").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/50 via-white to-amber-50/30">
      <BhindiHeader />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">Guest List</h1>
              <p className="text-muted-foreground">Manage your wedding guests and RSVPs</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                if (!open) resetForm();
                setIsAddDialogOpen(open);
              }}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Guest
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingGuest ? "Edit Guest" : "Add New Guest"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Guest name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Relation</Label>
                        <Input
                          value={formData.relation}
                          onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                          placeholder="e.g., Uncle, Best Friend"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Plus Ones</Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.plus_ones}
                          onChange={(e) => setFormData({ ...formData, plus_ones: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Table Number</Label>
                        <Input
                          type="number"
                          value={formData.table_number}
                          onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
                          placeholder="e.g., 5"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Food Preference</Label>
                      <Select
                        value={formData.food_preference}
                        onValueChange={(value) => setFormData({ ...formData, food_preference: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FOOD_PREFERENCES.map((pref) => (
                            <SelectItem key={pref.value} value={pref.value}>
                              {pref.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Input
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any special notes..."
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingGuest ? "Update" : "Add Guest"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-accent/20">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold">{totalGuests}</p>
                <p className="text-xs text-muted-foreground">Total Guests</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-emerald-200 bg-emerald-50/50">
              <CardContent className="p-4 text-center">
                <Check className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                <p className="text-2xl font-bold text-emerald-600">{confirmedGuests}</p>
                <p className="text-xs text-muted-foreground">Confirmed</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-amber-200 bg-amber-50/50">
              <CardContent className="p-4 text-center">
                <HelpCircle className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                <p className="text-2xl font-bold text-amber-600">{pendingGuests}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-accent/20">
              <CardContent className="p-4 text-center">
                <Utensils className="h-6 w-6 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium">{vegCount} Veg / {nonVegCount} Non-Veg</p>
                <p className="text-xs text-muted-foreground">Food Preferences</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-4 border-2 border-accent/20">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search guests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterRsvp} onValueChange={setFilterRsvp}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="RSVP Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All RSVPs</SelectItem>
                    {RSVP_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Guest Table */}
          <Card className="border-2 border-accent/20">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>RSVP</TableHead>
                    <TableHead className="hidden md:table-cell">+Ones</TableHead>
                    <TableHead className="hidden lg:table-cell">Food</TableHead>
                    <TableHead className="hidden lg:table-cell">Table</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {guests.length === 0 ? "No guests added yet" : "No guests match your filters"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGuests.map((guest) => {
                      const category = CATEGORIES.find(c => c.value === guest.category);
                      const rsvpStatus = RSVP_STATUSES.find(s => s.value === guest.rsvp_status);
                      return (
                        <TableRow key={guest.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{guest.name}</p>
                              {guest.relation && (
                                <p className="text-xs text-muted-foreground">{guest.relation}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="text-sm">
                              {guest.email && (
                                <p className="flex items-center gap-1 text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {guest.email}
                                </p>
                              )}
                              {guest.phone && (
                                <p className="flex items-center gap-1 text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  {guest.phone}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={category?.color}>
                              {category?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={guest.rsvp_status}
                              onValueChange={(value) => updateRsvpStatus(guest.id, value)}
                            >
                              <SelectTrigger className="w-[120px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {RSVP_STATUSES.map((status) => (
                                  <SelectItem key={status.value} value={status.value}>
                                    <span className={status.color}>{status.label}</span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {guest.plus_ones > 0 ? `+${guest.plus_ones}` : "-"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {guest.food_preference ? 
                              FOOD_PREFERENCES.find(f => f.value === guest.food_preference)?.label || "-" 
                              : "-"}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {guest.table_number || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEditDialog(guest)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDelete(guest.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>
        </div>
      </main>

      <BhindiFooter />
    </div>
  );
}
