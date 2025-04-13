"use client";

import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../../../utils/cn";
import { buttonVariants } from "../../../../ui/button";
import { Tooltip, TooltipTrigger } from "../../../../ui/tooltip";

interface NavProps {
    isCollapsed: boolean;
    className?: string;
    links: {
        name: string; // Nazwa wyświetlana w pełnym widoku
        label?: string; // Przykładowo liczba wiadomości lub etykieta
        icon: LucideIcon;
        variant?: "default" | "ghost";
        isActive?: boolean;
    }[];
}

export function Nav({ links, isCollapsed, className }: NavProps) {
    return (
        <div
            data-collapsed={isCollapsed}
            className={cn(
                "flex flex-col gap-3 py-2 transition-all duration-200",
                isCollapsed ? "py-2" : "px-2",
                className
            )}
        >
            <nav className="grid gap-2 px-2 ">
                {links?.map((link, index) =>
                    isCollapsed ? (
                        <Tooltip key={index} delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Link
                                    to="/"
                                    aria-label={link.name}
                                    className={cn(
                                        // Użycie wariantu ikony
                                        buttonVariants({ variant: link.variant || "ghost", size: "icon" }),
                                        "h-10 w-10 flex items-center justify-center rounded-full transition-colors duration-200 ",
                                        // Podświetlenie ikony przy hoverze
                                        "hover:bg-primary hover:text-white"
                                    )}
                                >
                                    {link.icon && <link.icon className="h-5 w-5" />}
                                </Link>
                            </TooltipTrigger>
                        </Tooltip>
                    ) : (
                        <Link
                            key={index}
                            to=""
                            className={cn(
                                "flex items-center justify-between gap-3 px-3 py-2 rounded-lg  transition-all duration-200 border bg-muted/30   ",
                                // Stan aktywny – wyraźny kolor i cień
                                link.isActive
                                    ? "bg-primary text-primary-foreground shadow-md border-transparent"
                                    : " text-primary-foreground  hover:bg-muted hover:text-primary",
                                // Dla wariantu domyślnego podkreślamy typografię
                                link.variant === "default" && "font-medium"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                {link.icon && <link.icon className="h-6 w-6" />}
                                <span className="text-xs">{link.name}</span>
                            </div>

                            <span className="flex items-center justify-center rounded-full bg-card px-2 py-0.5 text-xs font-medium">
                                {index}
                            </span>
                        </Link>
                    )
                )}
            </nav>
        </div>
    );
}
