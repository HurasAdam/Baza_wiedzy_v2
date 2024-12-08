
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import { SelectBox } from "../core/SelectBox";
import { useQuery } from "@tanstack/react-query";
import { conversationTopicApi } from "@/lib/conversationTopicsApi";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { ComboboxDemo } from "../core/ComboBox";
import ConversationReportCard from "../ConversationReportCard";
import { useDebounce } from "@/hooks/useDebounce";
import { PiPhoneCallFill } from "react-icons/pi";





interface Inputs {
    conversationTopic: string;

}



export default function ShortcutCallRegisterForm({setActualStep, setFullFormData, fullFormData}: IFirstStepForm) {


  const [title, setTitle] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const {debouncedValue} = useDebounce({value:title,delay:250})
  const queryParams={
    title:"",
    product:""
  }

  const {data:products}= useQuery({
    queryKey:["products"],
    queryFn:()=>{
      return productsApi.getAllProducts()
    }
  })

  console.log(selectedProduct)
  const formatedTags = products
  ? [{ label: "Wszystkie", value: "all" }, ...products?.map((tag) => ({ label: tag.name, value: tag.name }))]
  : [{ label: "Brak produktów", value: "brak" }];

    const { data: conversationTopics=[] } = useQuery({
        queryKey: ["conversationTopics"],
        queryFn: () => {
          return conversationTopicApi.getConversationTopics(queryParams)
        }
      })

      const filteredTopics = conversationTopics.filter((topic) => {
        const matchesTitle = topic.title.toLowerCase().includes(title.toLowerCase());
        const matchesProduct =
          selectedProduct === "" || // Brak filtra, pokaż wszystkie
          selectedProduct === "all" || // Wybrano opcję "Wszystkie"
          (topic.product?.name && topic.product.name === selectedProduct); // Porównanie z nazwą produktu
      
        return matchesTitle && matchesProduct; // Oba warunki muszą być spełnione
      });


      const formatedConversationTopcis= conversationTopics?.map((topic)=>{
        return {label:topic.title, value:topic?._id}
      })


    const maxDate = new Date().toISOString().split("T")[0]
    const {register, handleSubmit, formState, getValues,watch} = useForm<Inputs>({
        defaultValues:{
            conversationTopic:""
        }
    })
    const {errors} = formState

    const selectedTopic = watch("conversationTopic"); // Obserwuj wartość pola

    const handleSelectTag = (selected) => {
      if (selected === "all") {
        setSelectedProduct(""); // Pusty string oznacza brak filtra
      } else {
        setSelectedProduct(selected); // Inne wartości są normalnie ustawiane
      }
    };

    const handleClearSelectedTag = () =>{
      setSelectedTag("")
    }

    const onSubmit = (data: Inputs) => {
    
    

        }


    

        return (
          <div className=' grid grid-cols-1 p-1 gap-4  '>
            <div>
              <div className='grid grid-cols-1 bg-slate-200 border border-slate-200 p-3 rounded '>
            <h2 className='flex gap-1 items-center '>
              <PiPhoneCallFill className='w-6 h-6 text-slate-700'/>
              <span className='text-xl font-semibold text-slate-700'>Rejestr tematów rozmów</span>
              
              </h2>
      
              </div>
              <div className='grid grid-cols-2 items-center gap-4 bg-slate-200 p-3'>
              <Input 
              className=''
              placeholder='Wyszukaj temat rozmowy...'
              onChange={(e)=>setTitle(e.target.value)}/>
         
         <div className="relative">
 
      
      {formatedTags && <SelectBox 
      placeholder="Wybierz produkt"
      onChange={handleSelectTag}
      clearAuthorHandler={handleClearSelectedTag}
      value={selectedProduct}
      data={formatedTags}/>}
      </div>
      </div>
      
      
            <div className='flex flex-col gap-3.5 my-3'>
            {filteredTopics?.map((topic:ITopic) => {
              return (
      <ConversationReportCard topic={topic}/>
              )
            })}
            </div>
            </div>

          </div>
        )
      }
