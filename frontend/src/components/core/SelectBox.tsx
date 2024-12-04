import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useArticleFilters from "@/hooks/useArticleFilters";

export function SelectBox({data,onChange,label, value,placeholder}) {
  const {title, setFilters,tags,author,verified} = useArticleFilters();
  return (
<div className="flex flex-col ">
  <label htmlFor="" className="text-sm text-gray-500">{label}</label>
<Select 

onValueChange={onChange}
value={(value)}
>
      <SelectTrigger >
        <SelectValue 
        placeholder={placeholder || "Wybierz autora"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          
          {data?.map(({label,value})=>{
            return(
              <SelectItem 
         
              className="cursor-pointer"
              value={value}>{label}</SelectItem>
            )
          })}


        </SelectGroup>
      </SelectContent>
    </Select>
</div>
  )
}
