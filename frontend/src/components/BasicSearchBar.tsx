 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";





import { Input } from "@/components/ui/input"
import MultipleSelector from "./ui/MultiSelector";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tagsApi } from "@/lib/tagsApi";
import useArticleFilters from "@/hooks/useArticleFilters";
import { api } from "@/lib/api";
import { SelectBox } from "./core/SelectBox";
import { HiMiniXMark } from "react-icons/hi2";
import { IoIosSearch } from "react-icons/io";


 
const formSchema = z.object({
    title: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    employeeDescription: z.string().min(6, {
      message: "Odpowiedź dla pracownika jest wymagana.",
    }),
    clientDescription: z.string().min(10, {
      message: "Odpowiedź dla klienta jest wymagana.",
    }),
    tags: z.array(z.string()).nonempty({
      message: "Musisz dodać co najmniej jeden tag.",
    }), // tags to tablica stringów i musi zawierać przynajmniej jeden element
    isVerified: z.boolean().optional(), // Dodajemy isVerified, jeśli jest opcjonalny
  });
 
export function BasicSearchBar({onSave,visibleFields}) {

  const {title, setFilters,tags,author,verified} = useArticleFilters();
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(["react", "angular"]);
  // ...



  const {data}= useQuery({
    queryKey:["tags"],
    queryFn:()=>{
      return tagsApi.getAllTags()
    }
  })


const {data:authors} = useQuery({
  queryKey:["authros"],
  queryFn:()=>{
    return api.getUsers()
  }
})


const formatedTags = data?.tags?.map((tag)=>{
  return {label:tag.name, value:tag._id}
})



const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
      title: title ||"",
      employeeDescription:"",
      clientDescription:"",
      tags: tags?.tags?.map(tagId => formatedTags?.find(tag => tag.value === tagId)) || [], // Mapuj tagi z URL na obiekty
      isVerified:false
  },
})



const formatedAuthors = authors?.map((author)=>{
  return {label:author.name, value:author?._id}
})




const urlTitleHandler = (e) =>{
setFilters({title:e.target.value})
}

const urltagsHandler =(selected) =>{

   setFilters({tags:selected})

}
  
const clearTitleHandler = ()=>{
  setFilters({title:""})
}

const resetFiltersHandler = () =>{
  setFilters({title:"", tags:[], author:""})
}
 
const urlAuthroHandler = (selected) => {
console.log(selected)
  setFilters({ author: selected }); // Ustaw filtry
}


const currentTags = formatedTags?.filter(option => tags.includes(option.value)) || [];

 
  return (
<div className="space-y-5 w-full   ">
{visibleFields?.title &&  <div className="space-y-1.5 relative  ">
  <IoIosSearch className="absolute bottom-2 left-[2%] text-gray-600 w-5 h-5 pointer-events-none"/>
                <Input 
                     className="pl-10 placeholder:text-gray-600"
                value={title}
                placeholder="Jak odnotować zastępstwo" 
                     onChange={(e) => {
                  
                      urlTitleHandler(e);   
                    }}
                />
         
         {   title.length>0 && <HiMiniXMark
   type="button"
   onClick={clearTitleHandler}
   className="absolute bottom-2 right-[3%] w-6 h-6 cursor-pointer hover:text-blue-800"
/> }

</div> } 
        


{visibleFields.tags &&<div className="space-y-1.5 ">

 {    formatedTags &&   <MultipleSelector
placeholder="Wybierz tag..."
          defaultOptions={formatedTags && formatedTags}
          value={formatedTags?.filter(option => tags.includes(option.value))} // Dopasowanie wartości do formatu wieloselektora
          onChange={(selected) => {
          (selected.map(item => item.value)); // Aktualizujemy stan formularza
            urltagsHandler(selected); // Aktualizujemy stan filtrów i URL
          }}
          // placeholder={field.value.length === 0 ? "Wybierz tag..." : ""} 
          emptyIndicator={
            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400 ">
              No results found.
            </p>
          }
        />}
  

      </div>}



{visibleFields.authro &&<SelectBox 

data={formatedAuthors}
label="Autor"
onChange={urlAuthroHandler}/>}


{/* 
        <Button 
        onClick={resetFiltersHandler}
        type="button">Wyczyść</Button> */}
        </div>
 
  )
}