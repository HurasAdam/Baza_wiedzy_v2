import BadgeLabel from '@/components/core/BadgeLabel';
import { articlesApi } from '@/lib/articlesApi';
import { useQuery } from '@tanstack/react-query'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
import React from 'react'
import { useParams } from 'react-router-dom';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoMdArrowDropright } from "react-icons/io";
import { formatDate } from '@/lib/utils';
import { FaCalendarCheck } from 'react-icons/fa6';

const ArticleDetails = () => {
    const { id } = useParams();

const {data:article} = useQuery({
    queryKey:["article",id],
    queryFn:()=>{
        return articlesApi.getArticle({id})
    }
})


  return (
    <div className=' p-9 grid grid-cols-[5fr_2fr] gap-4'>
{/* LEFT SIDE */}
<div className=' flex flex-col space-y-3.5'>

<div className='border py-3.5 px-5 rounded-md'>
<span className='text-2xl'>{article?.title}</span>

</div>


<Accordion type="multiple" collapsible defaultValue={['item-1']} className='border rounded-md px-7 py-1 '>
  <AccordionItem value="item-1" className='border-0 '>
    <AccordionTrigger className='text-lg'>Opis dla pracownika</AccordionTrigger>
    <AccordionContent className='break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base'>
      {article?.employeeDescription}
    </AccordionContent>
  </AccordionItem>
</Accordion>




<Accordion type="multiple" collapsible defaultValue={['item-1']} className='border rounded-md px-7 py-1 '>
  <AccordionItem value="item-1" className='border-0 '>
    <AccordionTrigger className='text-lg'>Odpowiedź dla klienta</AccordionTrigger>
    <AccordionContent className='break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base'>
      {article?.clientDescription}
    </AccordionContent>
  </AccordionItem>
</Accordion>


</div>


{/* RIGHT SIDE */}
<div className='border rounded-md  xl:pb-8 xl:px-8 h-fit min-h-[300px] xl:sticky top-[75px]  flex flex-col gap-2'>
    <div className='space-y-4'>

{/* TAGS */}


<div className='flex justify-end pt-2.5'>
  <span className='text-xl'>...</span>
</div>
<div>
    <span className='text-sm text-gray-700'>Tagi</span>
<div className='py-2.5 px-0.5 space-x-1 space-y-1.5'>
  
    {article?.tags?.map((tag)=>{
        return(
            <BadgeLabel label={tag?.name}/>
        )
    })}
</div>
</div>

{/* STATUS */}
<div>
<span>Status</span>
{article?.isVerified ? (
              <span className="font-semibold flex items-center gap-x-6">
                <IoCheckmarkCircle className="h-5 w-5 text-green-500" />{" "}
                Zweryfikowany
              </span>
            ) : (
              <span className="font-semibold flex items-center gap-x-3">
                <BsFillQuestionCircleFill className="h-5 w-5 text-secondary text-gray-700" />
                Nie zweryfikowany
              </span>
            )}
</div>


{/* ID */}
<div className="flex flex-col ">
            <span className="text-sm text-slate-500 font-semibold">
              ID:{" "}
            </span>

            <span className="font-semibold flex items-center gap-x-3">
              <IoMdArrowDropright className="h-5 w-5 text-slate-600" />
              {article?._id}
            </span>
          </div>


{/* CREATEDAT */}

<div className="flex flex-col">
            <span className="text-sm text-slate-500 font-semibold">
              Dodano:{" "}
            </span>

            <span className="font-semibold flex items-center gap-x-6">
              <FaCalendarCheck className="h-5 w-5 text-slate-600" />
              {formatDate(article?.createdAt)}
            </span>
          </div>










</div>
</div>

    </div>
  )
}

export default ArticleDetails