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

export function DatePicker({ state, setState }) {
  const popOverRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !state && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {state ? format(state, "PPP") : <span>Pick a date</span>}
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
