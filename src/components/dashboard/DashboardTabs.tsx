
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingsTable from "@/components/booking/BookingsTable";
import NotificationsTab from "./NotificationsTab";
import RecommendationsTab from "./RecommendationsTab";
import PreferencesQuestionnaire from "./PreferencesQuestionnaire";
import { useIsBelowBreakpoint } from "@/hooks/use-mobile";
import { useNotifications } from "@/hooks/use-notifications";
import { Badge } from "@/components/ui/badge";

interface Recommendation {
  id: number;
  title: string;
  image: string;
  score: number;
}

interface DashboardTabsProps {
  recommendations: Recommendation[];
}

const DashboardTabs = ({ recommendations }: DashboardTabsProps) => {
  const isMobile = useIsBelowBreakpoint("sm");
  const { notifications, unreadCount } = useNotifications();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-1 sm:p-4">
      <Tabs defaultValue="reservas" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-4">
          <TabsTrigger value="reservas" className="text-sm sm:text-base">
            {isMobile ? "Reservas" : "Minhas Reservas"}
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="text-sm sm:text-base relative">
            {isMobile ? "Alertas" : "Notificações"}
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="preferencias" className="text-sm sm:text-base">
            {isMobile ? "Perfil" : "Preferências"}
          </TabsTrigger>
          <TabsTrigger value="recomendacoes" className="text-sm sm:text-base">
            {isMobile ? "Para Você" : "Recomendações"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="reservas" className="space-y-4">
          <BookingsTable />
        </TabsContent>
        
        <TabsContent value="notificacoes">
          <NotificationsTab notifications={notifications} />
        </TabsContent>

        <TabsContent value="preferencias">
          <PreferencesQuestionnaire />
        </TabsContent>
        
        <TabsContent value="recomendacoes">
          <RecommendationsTab recommendations={recommendations} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTabs;
