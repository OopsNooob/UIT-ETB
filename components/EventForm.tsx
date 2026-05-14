"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LeafletLocationPicker from "./LeafletLocationPicker";
import { EventSchema, type EventFormData } from "@/lib/validations/eventSchema";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";

// Use independent validation schema from lib/validations
type FormData = EventFormData;

interface InitialEventData {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date?: string;
  total_capacity: number;
  banner_url?: string;
}

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: InitialEventData;
}

export default function EventForm({ mode, initialData }: EventFormProps) {
  const { user } = useAuth();
  const { createEvent, updateEvent, isLoading: apiLoading } = useEvents();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: initialData?.title ?? "",
      description: initialData?.description ?? "",
      location: initialData?.location ?? "",
      eventDate: initialData ? new Date(initialData.start_date) : new Date(),
      price: 0,
      totalTickets: initialData?.total_capacity ?? 1,
    },
  });

  async function onSubmit(values: FormData) {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please sign in to create/edit events",
      });
      return;
    }

    startTransition(async () => {
      try {
        // Map form data to backend schema
        const startDate = values.eventDate;
        // End date is 1 hour after start date by default
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        const eventData = {
          title: values.name,
          description: values.description,
          location: values.location,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          total_capacity: values.totalTickets,
        };

        if (mode === "create") {
          const result = await createEvent(eventData);
          if (result.success && result.data) {
            toast({
              title: "Success",
              description: "Event created successfully",
            });
            router.push(`/event/${result.data.id}`);
          } else {
            throw new Error(result.error || "Failed to create event");
          }
        } else {
          if (!initialData) {
            throw new Error("Initial event data is required for updates");
          }
          const result = await updateEvent({
            id: initialData.id,
            ...eventData,
          });
          if (result.success) {
            toast({
              title: "Success",
              description: "Event updated successfully",
            });
            router.push(`/event/${initialData.id}`);
          } else {
            throw new Error(result.error || "Failed to update event");
          }
        }
      } catch (error) {
        console.error("Failed to handle event:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An error occurred while processing your request",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Form fields */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <LeafletLocationPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    onChange={(e) => {
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : null
                      );
                    }}
                      value={((v) => {
                          if (!v) {
                            return ''; // Trả về chuỗi rỗng nếu không có giá trị
                          }
                          const date = new Date(v);
                          // Kiểm tra xem date có phải là ngày hợp lệ không
                          if (isNaN(date.getTime())) {
                          console.error('Giá trị ngày không hợp lệ:', v); // Ghi log để debug
                          return ''; // Trả về chuỗi rỗng để tránh crash
                          }
                          // Định dạng ngày thành YYYY-MM-DD cho input
                          return date.toISOString().split('T')[0];
                  })(field.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalTickets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Tickets Available</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Event Image (Feature coming soon)
            </label>
            <div className="mt-1 p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 text-sm">
              Image upload functionality will be available soon. For now, focus on event details.
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending || apiLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isPending || apiLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {mode === "create" ? "Creating Event..." : "Updating Event..."}
            </>
          ) : mode === "create" ? (
            "Create Event"
          ) : (
            "Update Event"
          )}
        </Button>
      </form>
    </Form>
  );
}

