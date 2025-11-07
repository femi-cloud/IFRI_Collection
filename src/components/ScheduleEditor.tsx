import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";

interface ScheduleEditorProps {
  year: number;
  schedule?: any;
  onSuccess: () => void;
}

export const ScheduleEditor = ({ year, schedule, onSuccess }: ScheduleEditorProps) => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(schedule?.subject || "");
  const [professor, setProfessor] = useState(schedule?.professor || "");
  const [dayOfWeek, setDayOfWeek] = useState(schedule?.day_of_week || "Lundi");
  const [startTime, setStartTime] = useState(schedule?.start_time || "08:00");
  const [endTime, setEndTime] = useState(schedule?.end_time || "09:00");
  const [room, setRoom] = useState(schedule?.room || "");

  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const scheduleData = {
      subject,
      professor,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      room,
      year,
    };

    let error;
    if (schedule) {
      const { error: updateError } = await supabase
        .from('schedules')
        .update(scheduleData)
        .eq('id', schedule.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('schedules')
        .insert(scheduleData);
      error = insertError;
    }

    if (error) {
      toast.error("Erreur lors de l'enregistrement");
    } else {
      toast.success(schedule ? "Cours modifié" : "Cours ajouté");
      setOpen(false);
      onSuccess();
    }
  };

  const handleDelete = async () => {
    if (!schedule) return;

    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', schedule.id);

    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Cours supprimé");
      setOpen(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {schedule ? (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un cours
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {schedule ? "Modifier le cours" : "Ajouter un cours"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject">Matière</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="professor">Professeur</Label>
            <Input
              id="professor"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="day">Jour</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Heure de début</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">Heure de fin</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="room">Salle</Label>
            <Input
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {schedule ? "Modifier" : "Ajouter"}
            </Button>
            {schedule && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
