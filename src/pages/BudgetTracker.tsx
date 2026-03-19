import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobilePageHeader } from '@/components/mobile/MobilePageHeader';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  PiggyBank, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  Trash2,
  Edit2,
  Check,
  X,
  Camera,
  Utensils,
  Music,
  Sparkles,
  Building2,
  Cake,
  Palette,
  Users,
  Car,
  Gem,
  Star
} from 'lucide-react';
import { SEO } from '@/components/SEO';

interface BudgetAllocation {
  id: string;
  user_id: string;
  total_budget: number;
  category: string;
  allocated_amount: number;
  spent_amount: number;
  notes: string | null;
}

const categoryIcons: Record<string, React.ReactNode> = {
  photography: <Camera className="h-5 w-5" />,
  catering: <Utensils className="h-5 w-5" />,
  music: <Music className="h-5 w-5" />,
  decoration: <Sparkles className="h-5 w-5" />,
  venues: <Building2 className="h-5 w-5" />,
  cakes: <Cake className="h-5 w-5" />,
  mehendi: <Palette className="h-5 w-5" />,
  makeup: <Star className="h-5 w-5" />,
  transport: <Car className="h-5 w-5" />,
  jewelry: <Gem className="h-5 w-5" />,
  entertainment: <Users className="h-5 w-5" />,
  other: <Plus className="h-5 w-5" />
};

const defaultCategories = [
  { name: 'venues', label: 'Venue', percentage: 30 },
  { name: 'catering', label: 'Catering', percentage: 20 },
  { name: 'photography', label: 'Photography', percentage: 12 },
  { name: 'decoration', label: 'Decoration', percentage: 10 },
  { name: 'music', label: 'Music & DJ', percentage: 5 },
  { name: 'makeup', label: 'Makeup', percentage: 5 },
  { name: 'jewelry', label: 'Jewelry', percentage: 8 },
  { name: 'mehendi', label: 'Mehendi', percentage: 3 },
  { name: 'transport', label: 'Transport', percentage: 3 },
  { name: 'other', label: 'Other', percentage: 4 }
];

const BudgetTracker = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState<string>('');
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempAllocation, setTempAllocation] = useState<string>('');
  const [bookingSpending, setBookingSpending] = useState<Record<string, number>>({});

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    await Promise.all([loadBudgetData(session.user.id), loadBookingSpending(session.user.id)]);
    setLoading(false);
  };

  const loadBudgetData = async (userId: string) => {
    const { data, error } = await supabase
      .from('budget_allocations')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return;
    }

    if (data && data.length > 0) {
      setAllocations(data);
      setTotalBudget(data[0]?.total_budget || 0);
    }
  };

  const loadBookingSpending = async (userId: string) => {
    // Get spending from confirmed/completed bookings
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        total_amount,
        vendor_id,
        vendors!inner(category)
      `)
      .eq('couple_id', userId)
      .in('status', ['confirmed', 'in_progress', 'completed']);

    if (error) {
      return;
    }

    const spending: Record<string, number> = {};
    data?.forEach((booking: any) => {
      const category = booking.vendors?.category || 'other';
      spending[category] = (spending[category] || 0) + (Number(booking.total_amount) || 0);
    });
    setBookingSpending(spending);
  };

  const saveTotalBudget = async () => {
    const budget = parseFloat(tempBudget) || 0;
    if (budget <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // If no allocations exist, create default ones
    if (allocations.length === 0) {
      const newAllocations = defaultCategories.map(cat => ({
        user_id: session.user.id,
        total_budget: budget,
        category: cat.name,
        allocated_amount: Math.round(budget * (cat.percentage / 100)),
        spent_amount: bookingSpending[cat.name] || 0
      }));

      const { error } = await supabase
        .from('budget_allocations')
        .insert(newAllocations);

      if (error) {
        toast.error('Failed to save budget');
      } else {
        toast.success('Budget created successfully');
        await loadBudgetData(session.user.id);
      }
    } else {
      // Update existing allocations with new total
      const { error } = await supabase
        .from('budget_allocations')
        .update({ total_budget: budget })
        .eq('user_id', session.user.id);

      if (error) {
        toast.error('Failed to update budget');
      } else {
        setTotalBudget(budget);
        toast.success('Budget updated');
      }
    }

    setEditingBudget(false);
    setSaving(false);
  };

  const updateAllocation = async (category: string) => {
    const amount = parseFloat(tempAllocation) || 0;
    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('budget_allocations')
      .update({ allocated_amount: amount })
      .eq('user_id', session.user.id)
      .eq('category', category);

    if (error) {
      toast.error('Failed to update allocation');
    } else {
      setAllocations(prev => prev.map(a => 
        a.category === category ? { ...a, allocated_amount: amount } : a
      ));
      toast.success('Allocation updated');
    }

    setEditingCategory(null);
    setSaving(false);
  };

  const getTotalAllocated = () => allocations.reduce((sum, a) => sum + Number(a.allocated_amount), 0);
  const getTotalSpent = () => Object.values(bookingSpending).reduce((sum, v) => sum + v, 0);
  const getRemainingBudget = () => totalBudget - getTotalSpent();

  const getSpentPercentage = (category: string, allocated: number) => {
    const spent = bookingSpending[category] || 0;
    if (allocated === 0) return spent > 0 ? 100 : 0;
    return Math.min(100, (spent / allocated) * 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading budget tracker...</div>
      </div>
    );
  }

  const overallProgress = totalBudget > 0 ? (getTotalSpent() / totalBudget) * 100 : 0;

  return (
    <>
      <SEO
        title="Budget Tracker | Karlo Shaadi"
        description="Track your wedding budget and spending across all vendor categories."
      />

      <div className="min-h-screen bg-background">
        <MobilePageHeader title="Budget Tracker" />
        <div className={isMobile ? "px-4 py-4 pb-24 space-y-4" : "container mx-auto px-4 py-8 pt-24 max-w-5xl space-y-6"}>
          {/* Header - Desktop only */}
          {!isMobile && (
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Budget Tracker</h1>
              <p className="text-muted-foreground text-sm">Plan and track your wedding expenses</p>
            </div>
          )}

          {/* Budget Overview Cards */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}>
            {/* Total Budget */}
            <Card className="rounded-2xl border border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                    <PiggyBank className="h-5 w-5 text-primary" />
                  </div>
                  {!editingBudget && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTempBudget(totalBudget.toString());
                        setEditingBudget(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
                {editingBudget ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={tempBudget}
                      onChange={(e) => setTempBudget(e.target.value)}
                      placeholder="Enter budget"
                      className="h-8"
                    />
                    <Button size="sm" onClick={saveTotalBudget} disabled={saving}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingBudget(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-2xl font-semibold text-foreground">
                    {totalBudget > 0 ? formatCurrency(totalBudget) : 'Set Budget'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Total Spent */}
            <Card className="rounded-2xl border border-border/50">
              <CardContent className="pt-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 w-fit mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                <p className="text-2xl font-semibold text-foreground">
                  {formatCurrency(getTotalSpent())}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  From {Object.keys(bookingSpending).length} booking(s)
                </p>
              </CardContent>
            </Card>

            {/* Remaining */}
            <Card className={`rounded-2xl border transition-colors ${getRemainingBudget() < 0 ? 'border-destructive/40' : 'border-border/50'}`}>
              <CardContent className="pt-6">
                <div className={`p-2 rounded-lg w-fit mb-2 ${getRemainingBudget() < 0 ? 'bg-destructive/20' : 'bg-gradient-to-br from-primary/20 to-accent/20'}`}>
                  <AlertCircle className={`h-5 w-5 ${getRemainingBudget() < 0 ? 'text-destructive' : 'text-primary'}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                <p className={`text-2xl font-semibold ${getRemainingBudget() < 0 ? 'text-destructive' : 'text-foreground'}`}>
                  {formatCurrency(getRemainingBudget())}
                </p>
                {totalBudget > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(100 - overallProgress)}% of budget remaining
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress */}
          {totalBudget > 0 && (
            <Card className="rounded-2xl border border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Overall Spending Progress</h3>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(overallProgress)}% used
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, overallProgress)} 
                  className="h-3"
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{formatCurrency(getTotalSpent())} spent</span>
                  <span>{formatCurrency(totalBudget)} total</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category Allocations */}
          {totalBudget > 0 && allocations.length > 0 ? (
            <Card className="rounded-2xl border border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Category Breakdown</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Allocated: {formatCurrency(getTotalAllocated())} of {formatCurrency(totalBudget)}
                  {getTotalAllocated() !== totalBudget && (
                    <span className="text-amber-600 ml-2">
                      ({formatCurrency(totalBudget - getTotalAllocated())} unallocated)
                    </span>
                  )}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {allocations.map((allocation) => {
                  const spent = bookingSpending[allocation.category] || 0;
                  const progress = getSpentPercentage(allocation.category, allocation.allocated_amount);
                  const isOverBudget = spent > allocation.allocated_amount;
                  const label = defaultCategories.find(c => c.name === allocation.category)?.label || allocation.category;

                  return (
                    <div key={allocation.id} className="p-4 rounded-xl bg-muted/30 border border-border/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                            {categoryIcons[allocation.category] || <Plus className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{label}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(spent)} of {formatCurrency(allocation.allocated_amount)}
                            </p>
                          </div>
                        </div>
                        
                        {editingCategory === allocation.category ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={tempAllocation}
                              onChange={(e) => setTempAllocation(e.target.value)}
                              className="h-8 w-28"
                            />
                            <Button 
                              size="sm" 
                              onClick={() => updateAllocation(allocation.category)}
                              disabled={saving}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setEditingCategory(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTempAllocation(allocation.allocated_amount.toString());
                              setEditingCategory(allocation.category);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <Progress 
                        value={progress} 
                        className={`h-2 ${isOverBudget ? '[&>div]:bg-destructive' : ''}`}
                      />
                      
                      {isOverBudget && (
                        <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Over budget by {formatCurrency(spent - allocation.allocated_amount)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : totalBudget === 0 ? (
            <Card className="rounded-2xl border-2 border-dashed border-border/50">
              <CardContent className="py-12 text-center">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 w-fit mx-auto mb-4">
                  <PiggyBank className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Set Your Wedding Budget</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start by setting your total wedding budget. We'll help you allocate it across categories based on typical wedding spending patterns.
                </p>
                <Button 
                  onClick={() => {
                    setTempBudget('');
                    setEditingBudget(true);
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Set Budget
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {/* Tips Section */}
          <Card className="mt-4 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-6">
              <h3 className="font-medium mb-3">Budget Tips</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Keep 5-10% of your budget as a contingency fund for unexpected expenses</li>
                <li>• Venue and catering typically account for 40-50% of wedding budgets</li>
                <li>• Book vendors early to lock in current prices and secure your dates</li>
                <li>• Your spending is automatically tracked from confirmed bookings</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BudgetTracker;
