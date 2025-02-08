import { notificationApi } from "@/lib/notificationApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale"; // Import języka polskiego

const notificationStyles = {
  info: "border-blue-300 bg-blue-50 text-blue-900",
  warning: "border-yellow-300 bg-yellow-50 text-yellow-900",
  success: "border-green-300 bg-green-50 text-green-900",
};

const notificationIcons = {
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
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
    <div className="flex flex-col gap-4 px-1 max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-gray-900">Powiadomienia</h2>

      {notifications?.length === 0 ? (
        <div className="text-gray-500 text-center py-6">
          Brak nowych powiadomień
        </div>
      ) : (
        notifications?.map((notification) => {
          const isUnread = !notification.isRead;
          const formattedDate = format(new Date(notification.createdAt), "dd.MM.yyyy HH:mm", { locale: pl });

          return (
            <div
              key={notification._id}
              onClick={() => markAsRead.mutate(notification._id)}
              className={cn(
                "flex flex-col relative gap-3 p-4 border-l-4 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:translate-y-0.5 cursor-pointer active:scale-95",
                isUnread
                  ? "bg-slate-300 border-indigo-500" // Jasne tło dla nieprzeczytanych
                  : "bg-gray-100 border-gray-400" // Subtelne tło dla przeczytanych
              )}
            >
              <div className="flex items-center gap-3">
              
                <div className="flex-1">
                <div className="flex-shrink-0 flex items-center gap-2">
                  {notificationIcons[notification.type]}
                  <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                </div>
              
<div className="px-7">
                  {notification.articleTitle && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Artykuł:</strong> {notification.articleTitle}
                    </p>
                  )}

                  {notification.articleProduct && (
                    <p className="text-xs text-gray-600 mt-1">
                      <strong>Produkt:</strong> {notification.articleProduct}
                    </p>
                  )}

                  {notification.link && (
                    <a
                      href={notification.link}
                      className="mt-2 inline-flex items-center text-blue-600 hover:underline text-sm"
                    >
                      Zobacz artykuł
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              </div>
              </div>
              {/* Data powiadomienia w prawym dolnym rogu */}
              <div className="text-xs text-gray-500 absolute bottom-2 right-3">
                {formattedDate}
              </div>

              {/* Subtelne pulsowanie dla nieprzeczytanych */}
              {isUnread && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default NotificationsPanel;
