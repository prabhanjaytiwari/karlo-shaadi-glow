import { 
  Users, 
  Car, 
  Utensils, 
  Clock, 
  CreditCard, 
  MapPin,
  Accessibility,
  User,
  CalendarCheck
} from "lucide-react";

interface VendorQuickInfoProps {
  vendor: {
    category: string;
    team_size?: number;
    years_experience?: number;
    cities?: { name: string; state: string };
  };
  // These would come from extended vendor data in production
  additionalInfo?: {
    parkingCapacity?: number;
    cateringType?: "internal" | "external" | "both";
    staffGender?: "male" | "female" | "mixed";
    wheelchairAccessible?: boolean;
    travelsToClient?: boolean;
    cancellationPolicy?: "flexible" | "moderate" | "strict";
    responseTime?: string;
  };
}

export const VendorQuickInfo = ({ vendor, additionalInfo = {} }: VendorQuickInfoProps) => {
  // Default values for demo
  const info = {
    parkingCapacity: additionalInfo.parkingCapacity ?? 50,
    cateringType: additionalInfo.cateringType ?? "both",
    staffGender: additionalInfo.staffGender ?? "mixed",
    wheelchairAccessible: additionalInfo.wheelchairAccessible ?? true,
    travelsToClient: additionalInfo.travelsToClient ?? true,
    cancellationPolicy: additionalInfo.cancellationPolicy ?? "moderate",
    responseTime: additionalInfo.responseTime ?? "2 hours",
  };

  const getCancellationLabel = (policy: string) => {
    switch (policy) {
      case "flexible":
        return "Full refund up to 7 days before";
      case "moderate":
        return "50% refund up to 14 days before";
      case "strict":
        return "No refund after booking";
      default:
        return "Contact for details";
    }
  };

  const getCateringLabel = (type: string) => {
    switch (type) {
      case "internal":
        return "In-house catering only";
      case "external":
        return "External catering allowed";
      case "both":
        return "In-house & external catering";
      default:
        return "Contact for details";
    }
  };

  const infoItems = [
    {
      icon: Users,
      label: "Team Size",
      value: `${vendor.team_size || 1} professionals`,
      show: true,
    },
    {
      icon: Clock,
      label: "Experience",
      value: `${vendor.years_experience || 0}+ years`,
      show: true,
    },
    {
      icon: MapPin,
      label: "Location",
      value: vendor.cities ? `${vendor.cities.name}, ${vendor.cities.state}` : "Pan India",
      show: true,
    },
    {
      icon: CalendarCheck,
      label: "Response Time",
      value: `Within ${info.responseTime}`,
      show: true,
    },
    {
      icon: Car,
      label: "Parking",
      value: `${info.parkingCapacity}+ vehicles`,
      show: vendor.category === "venues",
    },
    {
      icon: Utensils,
      label: "Catering",
      value: getCateringLabel(info.cateringType),
      show: vendor.category === "venues",
    },
    {
      icon: User,
      label: "Staff",
      value: info.staffGender === "mixed" ? "Male & Female staff" : `${info.staffGender} staff`,
      show: ["mehendi", "makeup", "photography"].includes(vendor.category),
    },
    {
      icon: Accessibility,
      label: "Accessibility",
      value: info.wheelchairAccessible ? "Wheelchair accessible" : "Limited accessibility",
      show: vendor.category === "venues",
    },
    {
      icon: MapPin,
      label: "Travel",
      value: info.travelsToClient ? "Travels to client location" : "Client visits venue",
      show: ["mehendi", "makeup", "photography"].includes(vendor.category),
    },
    {
      icon: CreditCard,
      label: "Cancellation",
      value: getCancellationLabel(info.cancellationPolicy),
      show: true,
    },
  ];

  const visibleItems = infoItems.filter((item) => item.show);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {visibleItems.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <item.icon className="h-4 w-4 text-accent" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-medium truncate">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
