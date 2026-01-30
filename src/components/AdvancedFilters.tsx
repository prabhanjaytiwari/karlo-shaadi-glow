import { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FiltersState {
  budgetRange: [number, number];
  experience: string[];
  rating: number | null;
  quickFilters: string[];
}

interface AdvancedFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  onClearFilters: () => void;
  category?: string;
}

const experienceOptions = [
  { value: "0-2", label: "0-2 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10+", label: "10+ years" },
];

const ratingOptions = [
  { value: 4, label: "4+ Stars" },
  { value: 4.5, label: "4.5+ Stars" },
  { value: 5, label: "5 Stars Only" },
];

const quickFilterOptions = [
  { value: "travels", label: "Travels to Client", categories: ["mehendi", "makeup"] },
  { value: "wheelchair", label: "Wheelchair Accessible", categories: ["venues"] },
  { value: "vegetarian", label: "Vegetarian Options", categories: ["catering"] },
  { value: "sameday", label: "Same Day Booking", categories: [] },
];

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border/50 pb-4">
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 space-y-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

const FiltersContent = ({
  filters,
  onFiltersChange,
  onClearFilters,
  category,
}: AdvancedFiltersProps) => {
  const formatBudget = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const applicableQuickFilters = quickFilterOptions.filter(
    (opt) => opt.categories.length === 0 || opt.categories.includes(category || "")
  );

  const hasActiveFilters =
    filters.budgetRange[0] > 50000 ||
    filters.budgetRange[1] < 5000000 ||
    filters.experience.length > 0 ||
    filters.rating !== null ||
    filters.quickFilters.length > 0;

  return (
    <div className="space-y-4">
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      {/* Budget Range */}
      <FilterSection title="Budget Range">
        <div className="px-2">
          <Slider
            value={filters.budgetRange}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, budgetRange: value as [number, number] })
            }
            min={50000}
            max={5000000}
            step={50000}
            className="mb-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatBudget(filters.budgetRange[0])}</span>
            <span>{formatBudget(filters.budgetRange[1])}</span>
          </div>
        </div>
      </FilterSection>

      {/* Experience */}
      <FilterSection title="Experience">
        <div className="space-y-2">
          {experienceOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
            >
              <Checkbox
                checked={filters.experience.includes(option.value)}
                onCheckedChange={(checked) => {
                  const newExperience = checked
                    ? [...filters.experience, option.value]
                    : filters.experience.filter((v) => v !== option.value);
                  onFiltersChange({ ...filters, experience: newExperience });
                }}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating">
        <div className="space-y-2">
          {ratingOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
            >
              <Checkbox
                checked={filters.rating === option.value}
                onCheckedChange={(checked) => {
                  onFiltersChange({ ...filters, rating: checked ? option.value : null });
                }}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Quick Filters */}
      {applicableQuickFilters.length > 0 && (
        <FilterSection title="Quick Filters">
          <div className="space-y-2">
            {applicableQuickFilters.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
              >
                <Checkbox
                  checked={filters.quickFilters.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newQuickFilters = checked
                      ? [...filters.quickFilters, option.value]
                      : filters.quickFilters.filter((v) => v !== option.value);
                    onFiltersChange({ ...filters, quickFilters: newQuickFilters });
                  }}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
};

export const AdvancedFilters = (props: AdvancedFiltersProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-card rounded-xl border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Filters</h3>
          </div>
          <FiltersContent {...props} />
        </div>
      </div>

      {/* Mobile Sheet - More prominent button */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2 bg-primary text-primary-foreground shadow-md"
            >
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters</span>
              {(props.filters.experience.length > 0 || 
                props.filters.rating !== null || 
                props.filters.quickFilters.length > 0 ||
                props.filters.budgetRange[0] > 50000 ||
                props.filters.budgetRange[1] < 5000000) && (
                <span className="bg-white/20 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                  {props.filters.experience.length + 
                   (props.filters.rating ? 1 : 0) + 
                   props.filters.quickFilters.length +
                   (props.filters.budgetRange[0] > 50000 || props.filters.budgetRange[1] < 5000000 ? 1 : 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
            <SheetHeader className="pb-4 border-b">
              <SheetTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  Filter Vendors
                </span>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100%-80px)] mt-4">
              <FiltersContent {...props} />
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
              <Button className="w-full" size="lg">
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export const defaultFilters: FiltersState = {
  budgetRange: [50000, 5000000],
  experience: [],
  rating: null,
  quickFilters: [],
};

export type { FiltersState };
