
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export function SelectBox({
  data,
  onChange,
  label,
  value,
  placeholder,
  className,
}) {
  return (
    <div className="flex flex-col pb-1">
      <label htmlFor="" className="text-sm font-medium ">
        {label}
      </label>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder || "Wybierz autora"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {data?.map(({ label, value }) => {
              return (
                <SelectItem className="cursor-pointer" value={value}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
