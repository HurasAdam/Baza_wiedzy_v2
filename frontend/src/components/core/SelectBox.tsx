import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Data {
    label: string;
    value: string;
}

interface SelectBoxProps {
    data: Data[];
    value: string;
    onChange(value: string): void;
    placeholder?: string;
    label?: string;
}

export function SelectBox({ data, value, onChange, label, placeholder = "" }: SelectBoxProps) {
    return (
        <div className="flex flex-col pb-1">
            {label && <label className="text-sm font-medium ">{label}</label>}
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {data.map(({ label, value }) => (
                            <SelectItem key={value} className="cursor-pointer" value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
