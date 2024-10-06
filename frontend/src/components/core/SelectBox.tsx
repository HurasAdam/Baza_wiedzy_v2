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

export function SelectBox({data,onChange,label}) {
  const {title, setFilters,tags,author,verified} = useArticleFilters();
  return (
<div>
  <label htmlFor="">{label}</label>
<Select onValueChange={onChange}
value={author}
>
      <SelectTrigger >
        <SelectValue placeholder="Wybierz autora" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Autorzy</SelectLabel>
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
