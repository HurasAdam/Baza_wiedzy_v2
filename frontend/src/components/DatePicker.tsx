import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DateTypePicker } from "@/pages/StatisticsPage";
import { cn } from "@/utils/cn";
import { PopoverClose } from "@radix-ui/react-popover";
import { useRef } from "react";

interface IDatePickerProps {
    state: DateTypePicker;
    setState: (date: DateTypePicker) => void;
    label: string;
}

export function DatePicker({ state, setState, label, ...props }: IDatePickerProps & CalendarProps) {
    const popOverRef = useRef<HTMLButtonElement | null>(null);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left hover:bg-muted font-normal space-x-0.5",
                        !state && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className=" w-5 h-5" />
                    {state ? format(state, "PPP") : <span>{label}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <PopoverClose ref={popOverRef} />
                <Calendar
                    {...props}
                    mode="single"
                    selected={state}
                    onSelect={(date) => {
                        setState(date);
                        popOverRef.current?.click();
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
