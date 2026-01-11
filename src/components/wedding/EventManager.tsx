import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles,
  GripVertical,
  Edit2,
  Check
} from "lucide-react";

export interface WeddingEvent {
  id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address: string;
  dress_code: string;
  sort_order: number;
}

const eventPresets = [
  { name: "Mehendi", emoji: "🌿", defaultDressCode: "Colorful Traditional" },
  { name: "Haldi", emoji: "💛", defaultDressCode: "Yellow Attire" },
  { name: "Sangeet", emoji: "💃", defaultDressCode: "Semi-Formal" },
  { name: "Wedding Ceremony", emoji: "💍", defaultDressCode: "Traditional" },
  { name: "Reception", emoji: "🎉", defaultDressCode: "Formal" },
  { name: "Cocktail", emoji: "🍸", defaultDressCode: "Smart Casual" },
  { name: "Baraat", emoji: "🐴", defaultDressCode: "Traditional" },
  { name: "Pheras", emoji: "🔥", defaultDressCode: "Traditional" },
  { name: "Other", emoji: "✨", defaultDressCode: "" },
];

const dressCodeOptions = [
  "Traditional",
  "Formal",
  "Semi-Formal",
  "Smart Casual",
  "Casual",
  "Black Tie",
  "Yellow Attire",
  "Colorful Traditional",
  "White Attire",
  "Theme Based",
];

interface EventManagerProps {
  events: WeddingEvent[];
  onChange: (events: WeddingEvent[]) => void;
  weddingDate?: string;
}

export const EventManager = ({ events, onChange, weddingDate }: EventManagerProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addEvent = (preset?: typeof eventPresets[0]) => {
    const newEvent: WeddingEvent = {
      id: `temp-${Date.now()}`,
      event_name: preset?.name || "",
      event_date: weddingDate || "",
      event_time: "",
      venue_name: "",
      venue_address: "",
      dress_code: preset?.defaultDressCode || "",
      sort_order: events.length,
    };
    onChange([...events, newEvent]);
    setEditingId(newEvent.id);
  };

  const updateEvent = (id: string, field: keyof WeddingEvent, value: string | number) => {
    onChange(events.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeEvent = (id: string) => {
    onChange(events.filter(e => e.id !== id).map((e, i) => ({ ...e, sort_order: i })));
  };

  const moveEvent = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === events.length - 1) return;
    
    const newEvents = [...events];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newEvents[index], newEvents[targetIndex]] = [newEvents[targetIndex], newEvents[index]];
    onChange(newEvents.map((e, i) => ({ ...e, sort_order: i })));
  };

  const getEventEmoji = (name: string) => {
    const preset = eventPresets.find(p => p.name.toLowerCase() === name.toLowerCase());
    return preset?.emoji || "✨";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Wedding Events
          </h3>
          <p className="text-sm text-muted-foreground">Add all your wedding functions</p>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="flex flex-wrap gap-2">
        {eventPresets.slice(0, 6).map((preset) => {
          const isAdded = events.some(e => e.event_name.toLowerCase() === preset.name.toLowerCase());
          return (
            <Button
              key={preset.name}
              variant={isAdded ? "secondary" : "outline"}
              size="sm"
              onClick={() => !isAdded && addEvent(preset)}
              disabled={isAdded}
              className="gap-1.5"
            >
              <span>{preset.emoji}</span>
              {preset.name}
              {isAdded && <Check className="w-3 h-3 text-green-500" />}
            </Button>
          );
        })}
        <Button variant="outline" size="sm" onClick={() => addEvent()} className="gap-1.5">
          <Plus className="w-4 h-4" />
          Custom Event
        </Button>
      </div>

      {/* Event List */}
      <AnimatePresence>
        {events.length > 0 && (
          <div className="space-y-3">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="p-4 border-border/50 hover:border-accent/30 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Drag Handle & Order */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <span className="text-lg">{getEventEmoji(event.event_name)}</span>
                      <div className="flex flex-col gap-0.5">
                        <button 
                          onClick={() => moveEvent(index, "up")}
                          className="p-0.5 hover:bg-muted rounded disabled:opacity-30"
                          disabled={index === 0}
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground rotate-90" />
                        </button>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 space-y-3">
                      {editingId === event.id ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs mb-1 block">Event Name *</Label>
                              <Select
                                value={eventPresets.find(p => p.name === event.event_name)?.name || "Other"}
                                onValueChange={(value) => {
                                  const preset = eventPresets.find(p => p.name === value);
                                  updateEvent(event.id, "event_name", value === "Other" ? "" : value);
                                  if (preset?.defaultDressCode) {
                                    updateEvent(event.id, "dress_code", preset.defaultDressCode);
                                  }
                                }}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Select event" />
                                </SelectTrigger>
                                <SelectContent>
                                  {eventPresets.map((preset) => (
                                    <SelectItem key={preset.name} value={preset.name}>
                                      {preset.emoji} {preset.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {(!eventPresets.find(p => p.name === event.event_name) && event.event_name !== "") && (
                                <Input
                                  value={event.event_name}
                                  onChange={(e) => updateEvent(event.id, "event_name", e.target.value)}
                                  placeholder="Custom event name"
                                  className="mt-2 h-9"
                                />
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs mb-1 block">Date</Label>
                                <Input
                                  type="date"
                                  value={event.event_date}
                                  onChange={(e) => updateEvent(event.id, "event_date", e.target.value)}
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <Label className="text-xs mb-1 block">Time</Label>
                                <Input
                                  type="time"
                                  value={event.event_time}
                                  onChange={(e) => updateEvent(event.id, "event_time", e.target.value)}
                                  className="h-9"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs mb-1 block">Venue Name</Label>
                              <Input
                                value={event.venue_name}
                                onChange={(e) => updateEvent(event.id, "venue_name", e.target.value)}
                                placeholder="e.g., Taj Palace"
                                className="h-9"
                              />
                            </div>
                            <div>
                              <Label className="text-xs mb-1 block">Venue Address</Label>
                              <Input
                                value={event.venue_address}
                                onChange={(e) => updateEvent(event.id, "venue_address", e.target.value)}
                                placeholder="e.g., New Delhi"
                                className="h-9"
                              />
                            </div>
                            <div>
                              <Label className="text-xs mb-1 block">Dress Code</Label>
                              <Select
                                value={event.dress_code || ""}
                                onValueChange={(value) => updateEvent(event.id, "dress_code", value)}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Select dress code" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dressCodeOptions.map((code) => (
                                    <SelectItem key={code} value={code}>
                                      {code}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => setEditingId(null)}
                            className="gap-1.5"
                          >
                            <Check className="w-3 h-3" /> Done
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {event.event_name || "Unnamed Event"}
                              {event.dress_code && (
                                <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                                  {event.dress_code}
                                </span>
                              )}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                              {event.event_date && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(event.event_date).toLocaleDateString('en-IN', { 
                                    day: 'numeric', month: 'short', year: 'numeric' 
                                  })}
                                </span>
                              )}
                              {event.event_time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {event.event_time}
                                </span>
                              )}
                              {event.venue_name && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {event.venue_name}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingId(event.id)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeEvent(event.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {events.length === 0 && (
        <Card className="p-8 text-center border-dashed">
          <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No events added yet</p>
          <p className="text-sm text-muted-foreground">
            Click on the event buttons above to add your wedding functions
          </p>
        </Card>
      )}
    </div>
  );
};
