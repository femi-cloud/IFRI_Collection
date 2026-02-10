import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { ScheduleEditor } from "@/components/ScheduleEditor";
import { getSchedules, Schedule as ScheduleType } from "@/lib/api";

const Schedule = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [selectedYear, setSelectedYear] = useState("1");

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const response = await getSchedules(parseInt(selectedYear));
      // ✅ Extraire les résultats paginés
      const schedulesData = response.data.results;
      console.log('📅 Emplois du temps:', schedulesData);
      setSchedules(schedulesData);

    } catch (error) {
      console.error('Erreur lors du chargement des emplois du temps:', error);
      setSchedules([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSchedules();
    }
  }, [selectedYear, user]);

  const years = [
    { id: "1", name: "1ère Année" },
    { id: "2", name: "2ème Année" },
    { id: "3", name: "3ème Année" },
  ];

  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8h to 19h

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Format HH:MM from HH:MM:SS
  };

  const getScheduleForDayAndTime = (day: string, hour: number) => {
    return schedules.filter((s) => {
      const startHour = parseInt(s.start_time.split(':')[0]);
      const endHour = parseInt(s.end_time.split(':')[0]);
      return s.day_of_week === day && startHour <= hour && hour < endHour;
    })[0];
  };

  if (loading || roleLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              Emploi du Temps
            </h1>
            <p className="text-muted-foreground">
              Consultez les horaires de cours pour chaque année
            </p>
          </div>
          {isAdmin && (
            <ScheduleEditor year={parseInt(selectedYear)} onSuccess={fetchSchedules} />
          )}
        </div>

        <Tabs value={selectedYear} onValueChange={setSelectedYear} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
            {years.map((year) => (
              <TabsTrigger 
                key={year.id} 
                value={year.id}
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {year.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {years.map((year) => (
            <TabsContent key={year.id} value={year.id}>
              <Card className="overflow-x-auto">
                <CardContent className="p-0">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border border-border p-3 text-left font-semibold sticky left-0 bg-muted/50 z-10">
                          Heure
                        </th>
                        {daysOfWeek.map((day) => (
                          <th key={day} className="border border-border p-3 text-left font-semibold min-w-[180px]">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {hours.map((hour) => (
                        <tr key={hour} className="hover:bg-muted/20 transition-colors">
                          <td className="border border-border p-3 font-medium sticky left-0 bg-background z-10">
                            {hour}h - {hour + 1}h
                          </td>
                          {daysOfWeek.map((day) => {
                            const schedule = getScheduleForDayAndTime(day, hour);
                            return (
                              <td key={day} className="border border-border p-2">
                                {schedule ? (
                                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-3 rounded-lg border-l-4 border-l-accent relative group">
                                    <div className="space-y-1">
                                      <h4 className="font-semibold text-sm text-foreground">
                                        {schedule.subject}
                                      </h4>
                                      <p className="text-xs text-muted-foreground">
                                        {schedule.professor}
                                      </p>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {schedule.room}
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                      </div>
                                    </div>
                                    {isAdmin && (
                                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ScheduleEditor
                                          year={parseInt(selectedYear)}
                                          schedule={schedule}
                                          onSuccess={fetchSchedules}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ) : null}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Schedule;