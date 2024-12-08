import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { conversationTopicApi } from '@/lib/conversationTopicsApi'
import { useQuery } from '@tanstack/react-query'
import { PiPhoneCallFill } from "react-icons/pi";
import React, { useState } from 'react'
import ConversationReportCard from '@/components/ConversationReportCard';
import { conversationReportApi } from '@/lib/conversationReportsApi';
import { TbReportSearch } from "react-icons/tb";
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { tagsApi } from '@/lib/tagsApi';
import { HiMiniXMark } from 'react-icons/hi2';
import { SelectBox } from '@/components/core/SelectBox';
import { productsApi } from '@/lib/productsApi';


export interface ITopic{
  _id:string;
  title:string;
  createdBy:string;
  __v:number;
}


const CallRegister = () => {


  const [title, setTitle] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const {debouncedValue} = useDebounce({value:title,delay:250})
  const queryParams={
    title:debouncedValue,
    product:selectedProduct
  }



  const { data: conversationTopics=[] } = useQuery({
    queryKey: ["conversationTopics",queryParams],
    queryFn: () => {
      return conversationTopicApi.getConversationTopics(queryParams)
    }
  })

  const {data:products}= useQuery({
    queryKey:["products"],
    queryFn:()=>{
      return productsApi.getAllProducts()
    }
  })

  const formatedTags = products
  ? [{ label: "Wszystkie", value: "all" }, ...products?.map((tag) => ({ label: tag.name, value: tag._id }))]
  : [{ label: "Brak produktów", value: "brak" }];





  const handleSelectTag = (selected) => {
    if (selected === "all") {
      setSelectedProduct(""); // Pusty string oznacza brak filtra
    } else {
      setSelectedProduct(selected); // Inne wartości są normalnie ustawiane
    }
  };

console.log("selectedTag")
console.log(selectedTag)

const handleClearSelectedTag = () =>{
  setSelectedTag("")
}

  const { data: conversationReportValues=[] } = useQuery({
    queryKey: ["conversationReports"],
    queryFn: () => {
      return conversationReportApi.getConversationReportValues()
    }
  })



  return (
    <div className=' grid grid-cols-[5fr_2fr] p-3 gap-4  '>
      <div>
        <div className='grid grid-cols-[1fr_2fr] bg-slate-200 border border-slate-200 p-3 rounded '>
      <h2 className='flex gap-1 items-center py-4'>
        <PiPhoneCallFill className='w-6 h-6 text-slate-700'/>
        <span className='text-xl font-semibold text-slate-700'>Rejestr tematów rozmów</span>
        
        </h2>
        <div className='grid grid-cols-2 items-center gap-4 '>
        <Input 
        className=''
        placeholder='Wyszukaj temat rozmowy...'
        onChange={(e)=>setTitle(e.target.value)}/>
   
   <div className="relative">
{   selectedTag && <HiMiniXMark
   type="button"
   onClick={(e)=>handleClearSelectedTag(e)}
   className="absolute bottom-2 right-[3%] w-6 h-6 cursor-pointer hover:text-blue-800"
/> }

{formatedTags && <SelectBox 
placeholder="Wybierz produkt"
onChange={handleSelectTag}
clearAuthorHandler={handleClearSelectedTag}
value={selectedTag}
data={formatedTags}/>}
</div>
</div>
        </div>



      <div className='flex flex-col gap-3.5 my-3'>
      {conversationTopics?.map((topic:ITopic) => {
        return (
<ConversationReportCard topic={topic}/>
        )
      })}
      </div>
      </div>
      <div className='px-3 pt-12' >
      <h2 className='flex gap-1 items-center '>
        <TbReportSearch className='w-5 h-5 text-slate-700'/>
        <span className='text-lg font-semibold text-slate-700'>Najczęsciej odnotowywane</span>
        </h2>
        <div className=' p-2'>
        <div className=' px-1 grid grid-cols-[6fr_1fr] text-sm font-semibold text-slate-600  rounded-lg my-1 justify-between'>
          <div>Temat</div>
          <div>Ilość</div>
          </div>
      {conversationReportValues?.map((reportTopicItem)=>{
        return(
          <div className='border px-2.5 py-2 grid grid-cols-[6fr_1fr] bg-white rounded-lg my-1 justify-between'>
          <div>{reportTopicItem.topicTitle}</div>
          <div>{reportTopicItem.reportCount}</div>
          </div>
        )
      })}
      </div>
      </div>
    </div>
  )
}

export default CallRegister
