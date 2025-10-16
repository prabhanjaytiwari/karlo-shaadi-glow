import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const serviceSchema = z.object({
  service_name: z.string().min(3, "Service name must be at least 3 characters"),
  description: z.string().optional(),
  base_price: z.string().regex(/^\d+$/, "Must be a valid number").transform(Number),
  price_range_min: z.string().regex(/^\d+$/, "Must be a valid number").transform(Number).optional(),
  price_range_max: z.string().regex(/^\d+$/, "Must be a valid number").transform(Number).optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  vendorId: string;
  service?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ServiceForm({ vendorId, service, open, onOpenChange, onSuccess }: ServiceFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      service_name: service?.service_name || "",
      description: service?.description || "",
      base_price: service?.base_price?.toString() || "",
      price_range_min: service?.price_range_min?.toString() || "",
      price_range_max: service?.price_range_max?.toString() || "",
    },
  });

  const onSubmit = async (data: ServiceFormData) => {
    setLoading(true);
    try {
      const serviceData = {
        vendor_id: vendorId,
        service_name: data.service_name,
        description: data.description,
        base_price: data.base_price,
        price_range_min: data.price_range_min,
        price_range_max: data.price_range_max,
      };

      if (service?.id) {
        const { error } = await supabase
          .from("vendor_services")
          .update(serviceData)
          .eq("id", service.id);

        if (error) throw error;
        toast({ title: "Service updated successfully" });
      } else {
        const { error } = await supabase
          .from("vendor_services")
          .insert(serviceData);

        if (error) throw error;
        toast({ title: "Service created successfully" });
      }

      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error saving service", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            Add or update your service details and pricing
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="service_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Premium Photography Package" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your service..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="base_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price_range_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="40000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_range_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="100000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {service ? "Update" : "Create"} Service
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
