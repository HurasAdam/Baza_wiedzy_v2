"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface Props {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export function ConfirmationCheckbox({ id, label, checked, onChange, disabled }: Props) {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} className="w-5 h-5" />
            <label
                htmlFor={id}
                className="text-sm text-foreground/90 font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {label}
                <span className="text-foreground/65 mx-1 text-xs">(Wymagane)</span>
            </label>
        </div>
    );
}
