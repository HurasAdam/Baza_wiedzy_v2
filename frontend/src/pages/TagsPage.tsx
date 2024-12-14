
import TagForm from '@/components/forms/TagForm';
import { Button } from '@/components/ui/button';
import { useModalContext } from '@/contexts/ModalContext';
import { tagsApi } from '@/lib/tagsApi'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { HiOutlineHashtag } from 'react-icons/hi';
import { MdDelete, MdEdit } from 'react-icons/md';

const TagsPage = () => {
  const {openContentModal, closeContentModal} = useModalContext()

const {data:tags} = useQuery({
    queryFn:()=>{
        return tagsApi.getAllTags()
    },
    queryKey:["tags"]
});


return (
    <div className="flex flex-col gap-1 px-10 py-3 ">
      <div className="px-0.5 pt-2 mb-10 flex items-center gap-2 justify-between ">
        <h2 className='text-xl font-bold text-gray-600 flex items-center gap-2 '><HiOutlineHashtag className="text-blue-900"/>Lista Tagów</h2>
       <div className=' mx-5 '>
       <Button 
      onClick={()=>{
        openContentModal({height:"fit",size:"sm",title:"Dodaj tag", description:"Wypełnij wymagane dane i zatwierdź, aby dodać nowy tag", content:(<TagForm/>)})
       }}
       className='rounded-lg bg-blue-600 text-white font-semibold py-2'

       >Dodaj nowy tag</Button>
       </div>
      </div>

  
  <div className='flex flex-col gap-4   '>
    {tags?.map((tag)=>{
        return(
            <div 
            key={tag?._id}
            className='border 2xl:w-[45%] px-4 py-2.5  border-gray-400/70 shadow-xs rounded-xl'
       
            >
             <div className='flex justify-between'>
             <span className='font-semibold text-gray-700/90'>{tag?.name}</span>
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
        )
    })}
  </div>

    </div>
  )
}

export default TagsPage