import { notificationApi } from "@/lib/notificationApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Link } from "react-router-dom";

const notificationStyles = {
  info: "border-blue-400 bg-blue-50 text-blue-900",
  warning: "border-yellow-400 bg-yellow-50 text-yellow-900",
  success: "border-green-400 bg-green-50 text-green-900",
};

const notificationIcons = {
  info: <Info className="w-6 h-6 text-blue-600" />,
  warning: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
  success: <CheckCircle className="w-6 h-6 text-green-600" />,
};

const NotificationsPanel = () => {
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationApi.getUserNotifications(),
  });

  const markAsRead = useMutation({
    mutationFn: (id) => notificationApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
  });

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold text-gray-900 pb-4 border-b">🔔 Powiadomienia</h2>

      {notifications?.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Brak nowych powiadomień
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {notifications?.map((notification) => {
            const isUnread = !notification.isRead;
            const formattedDate = format(new Date(notification.createdAt), "dd.MM.yyyy HH:mm", { locale: pl });

            return (
              <div
                key={notification._id}
                onClick={() => markAsRead.mutate(notification._id)}
                className={cn(
                  "relative flex flex-col gap-2 p-4 border-l-4 rounded-lg shadow-md transition-all duration-200 cursor-pointer",
                  "hover:bg-opacity-90  active:opacity-80",
                  isUnread ? "bg-blue-100 border-blue-500" : "bg-gray-100 border-gray-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">{notificationIcons[notification.type]}</div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{notification.message}</p>

                    {notification.articleTitle && (
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>Artykuł:</strong> {notification.articleTitle}
                      </p>
                    )}

                    {notification.articleProduct && (
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>Produkt:</strong> {notification.articleProduct}
                      </p>
                    )}

                    {notification.link && (
                      <Link
                        to={notification.link}
                        className="mt-2 inline-flex items-center text-blue-600 hover:underline text-sm"
                      >
                        Zobacz więcej
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Data powiadomienia */}
                <div className="text-xs text-gray-500 absolute bottom-2 right-3">
                  {formattedDate}
                </div>

                {/* Subtelne pulsowanie dla nieprzeczytanych */}
                {isUnread && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
