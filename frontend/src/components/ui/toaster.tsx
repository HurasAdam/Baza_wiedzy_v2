import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();




const getIconByVariant = (variant: string) => {
  switch (variant) {
    case "success":
      return <CheckCircle className="h-6 w-6 text-green-100" />;
    case "warning":
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    case "error":
    case "destructive":
      return <AlertCircle className="h-6 w-6 text-red-500" />;
    case "info":
    default:
      return <Info className="h-6 w-6 text-blue-500" />;
  }
};

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant = "default", ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            variant={variant}
          >
            <div className="flex items-center space-x-4">
              {/* Ikona na podstawie wariantu */}
              {getIconByVariant(variant)}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}