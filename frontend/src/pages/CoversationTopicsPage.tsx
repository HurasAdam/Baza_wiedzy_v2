
import ConversationTopicForm from '@/components/forms/conversationTopicForm';
import { Button } from '@/components/ui/button';
import { useModalContext } from '@/contexts/ModalContext';
import { conversationTopicApi } from '@/lib/conversationTopicsApi';
import { productsApi } from '@/lib/productsApi';
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { MdSubject } from "react-icons/md";
import { MdDelete, MdEdit } from 'react-icons/md';

const CoversationTopicsPage = () => {
  const {openContentModal} = useModalContext()

const {data:products} = useQuery({
    queryFn:()=>{
        return conversationTopicApi.getConversationTopics({title:"",product:""})
    },
    queryKey:["coversationTopics"]
});


return (
    <div className="flex flex-col gap-1 px-10 py-3 ">
      <div className="px-0.5 pt-2 mb-10 flex items-center gap-2 justify-between ">
        <h2 className='text-xl font-bold text-gray-600 flex items-center gap-2 '><MdSubject className="text-blue-900"/>Lista tematów rozmów</h2>
       <div className=' mx-5 '>
       <Button 
   onClick={()=>openContentModal({size:"sm",title:"Dodaj nowy temat rozmowy", content:(<ConversationTopicForm/>)})}
       className='rounded-lg bg-blue-600 text-white font-semibold py-2'

       >Dodaj nowy temat</Button>
       </div>
      </div>

  
  <div className='flex flex-col gap-4   '>
    {products?.map((tag)=>{
        return(
            <div 
            key={tag?._id}
            className='border 2xl:w-[45%] px-4 py-2.5  border-gray-400/70 shadow-xs rounded-xl'
       
            >
             <div className='flex flex-col justify-between'>
             <div className='flex gap-2  items-center font-semibold text-gray-700/90 text-xs border rounded-lg bg-slate-500 text-neutral-50 px-1.5 py-[3px]  '>
             <div 
                        style={{ backgroundColor: tag?.product?.labelColor }} 
                    className='w-3 h-3 rounded-xs bg-orange-200'></div>
             {tag?.product?.name}</div>
             <div className='font-semibold text-gray-700/90 grid grid-cols-[12fr_1fr] pt-2 pb-0.5 '>
             
         <span>    {tag?.title}</span>
         <div className='flex items-center gap-4'>
<MdEdit 
           className='w-5 h-5 cursor-pointer text-gray-600/90 hover:text-blue-300'
     
           />

<MdDelete 
className='text-rose-600/60 cursor-pointer hover:text-rose-500'

/>

</div>
             </div>
           


             </div>
            </div>
        )
    })}
  </div>

    </div>
  )
}

export default CoversationTopicsPage