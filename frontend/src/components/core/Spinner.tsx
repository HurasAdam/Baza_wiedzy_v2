import React from "react";
import { cn } from "@/lib/utils"; // Funkcja do łączenia klas (opcjonalna)

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  animation?: "spin" | "bounce" | "none";
  position?: "center" | "static";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "bg-slate-500",
  animation = "spin",
  position = "static",
  className = "",
}) => {
  // Rozmiary dla różnych animacji
  const sizeClasses = {
    sm: {
      spin: "w-6 h-6 border-2",
      bounce: "w-2 h-2",
    },
    md: {
      spin: "w-10 h-10 border-4",
      bounce: "w-3 h-3",
    },
    lg: {
      spin: "w-16 h-16 border-4",
      bounce: "w-4 h-4",
    },
  }[size];

  const positionClasses =
    position === "center"
      ? "fixed top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      : "static";

  return (
    <div
      className={cn(
        "flex justify-center items-center",
        positionClasses,
        className
      )}
    >
      {animation === "spin" && (
        <div
          className={cn(
            "rounded-full border-t-transparent border-solid",
            sizeClasses.spin,
            "animate-spin",
            color
          )}
        />
      )}
      {animation === "bounce" && (
        <div className="flex space-x-1">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className={cn(
                "rounded-full animate-bounce",
                sizeClasses.bounce,
                color
              )}
              style={{
                animationDelay: `${index * 0.1}s`, // Delikatne opóźnienie między kropkami
              }}
            />
          ))}
        </div>
      )}
      {animation === "none" && <div>No animation</div>}
    </div>
  );
};

export default Spinner;
