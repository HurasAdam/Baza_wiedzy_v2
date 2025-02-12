import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { useRef } from "react";

interface IDatePickerProps {
  state: Date | undefined;
  setState: (date: Date | undefined) => void;
  label: string;
}
export function DatePicker({ state, setState,label }:IDatePickerProps) {
  const popOverRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal space-x-0.5",
            !state && "text-muted-foreground"
          )}
        >
          <CalendarIcon className=" w-5 h-5"/>
          {state ? format(state, "PPP") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <PopoverClose ref={popOverRef} />
        <Calendar
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
