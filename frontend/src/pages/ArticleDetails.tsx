import BadgeLabel from '@/components/core/BadgeLabel';
import { articlesApi } from '@/lib/articlesApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { IoMdArrowDropright, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { formatDate } from '@/lib/utils';
import { FaCalendarCheck } from 'react-icons/fa6';
import { Dropdown } from '@/components/core/Dropdown';
import { HiDotsHorizontal } from "react-icons/hi";
import { FaStar } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { toast } from '@/hooks/use-toast';

const ArticleDetails = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();

const {data:article} = useQuery({
    queryKey:["article",id],
    queryFn:()=>{
        return articlesApi.getArticle({id})
    }
})


const {mutate} = useMutation({
  mutationFn:({id,isVerified})=>{
    return articlesApi.verifyArticle({id,isVerified})
  },
  onSuccess:(data)=>{
  queryClient.invalidateQueries(["article",id])
  toast({
    title: "Sukces",
    description: data.message,
    duration: 3550
  })
  }
})

const {mutate:markAsFavouriteHandler} = useMutation({
  mutationFn:({id})=>{
    return articlesApi.markArticleAsFavourite({id})
  },
  onSuccess:(data)=>{
  queryClient.invalidateQueries(["article",id])
  toast({
    title: "Sukces",
    description: data?.message,
    duration: 3550
  })
  }
})







const articleDropdownOptions= [
  {label:`${article?.isFavourite ? "Usuń z ulubionych":"Dodaj do ulubionych"}`, icon:<FaStar/>, actionHandler: () => markAsFavouriteHandler({id})},
  {label:"Edytuj", icon:<FaEdit/>, actionHandler: () => console.log("ustawienia")},

  ...(article?.isVerified
    ? [
        {
          label: "Cofnij weryfikację",
        
    
            actionHandler:()=>{
              mutate({ id, isVerified: false })},
          icon: <TiArrowBack />,
          }
      ]
    : [
        {
          label: "Zweryfikuj",
        
   
            actionHandler:()=>{
              mutate({ id, isVerified: true })},
       
          icon: <IoMdCheckmarkCircleOutline />,
        },
      ]),

  // {label:"Zweryfikuj", icon: article?.isVerified ?<IoArrowBackCircleSharp/>:<FaCheckCircle/> , actionHandler:()=>mutate({id, isVerified: true }) },
  {label:"Usuń", icon:<MdDelete/>, actionHandler: console.log("OK") },
];



  return (
    <div className=' p-9 grid grid-cols-[5fr_2fr] gap-4'>
{/* LEFT SIDE */}
<div className=' flex flex-col space-y-3.5'>

<div className='border py-3.5 px-5 rounded-md flex items-center justify-between'>
<span className='text-2xl'>{article?.title}</span>
{article?.isFavourite &&<FaStar className='w-5 h-5'/>}
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


<div className='flex justify-end pt-3'>

<Dropdown 

position={{
  side: "center", // Otwiera dropdown po prawej stronie
  align: "start", // Wyrównuje do początku elementu trigger
  sideOffset: -116, // Przesunięcie w osi pionowej
  alignOffset: 20, // Przesunięcie w osi poziomej
}}
options={articleDropdownOptions} triggerBtn={<div className='mt-0.5'><HiDotsHorizontal className='cursor-pointer'/></div>}/>

</div>
<div>
    <span className='text-sm font-semibold text-gray-500'>Tagi</span>
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
<span className='text-sm text-slate-500 font-semibold'>Status</span>
{article?.isVerified ? (
              <span className="font-semibold flex items-center gap-x-6">
                <IoCheckmarkCircle className="h-5 w-5 text-green-500" />{" "}
                Zweryfikowany
              </span>
            ) : (
              <span className="font-semibold flex items-center gap-x-3">
                <BsFillQuestionCircleFill className="h-5 w-5 text-secondary text-slate-600" />
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