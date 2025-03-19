import { cn } from "@/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    animation?: "pulse" | "spin" | "bounce" | "none"; // Dodajemy różne typy animacji
}

function Skeleton({ className, animation = "pulse", ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "rounded-md bg-gray-300",
                animation === "pulse" && "animate-pulse",
                animation === "spin" && "animate-spin",
                animation === "bounce" && "animate-bounce",
                animation === "none" && "", // Brak animacji
                className
            )}
            {...props}
        />
    );
}

export { Skeleton };
