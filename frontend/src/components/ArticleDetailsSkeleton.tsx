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
import { useNavigate, useParams } from 'react-router-dom';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useOutletContext } from "react-router-dom";
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
import { Skeleton } from "@/components/ui/skeleton"
import { useModalContext } from '@/contexts/ModalContext';

const ArticleDetailsSkeleton = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
 const navigate = useNavigate()
    const { openModal } = useModalContext();



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

const {mutate:deleteArticleMutation} = useMutation({
  mutationFn:({id})=>{
    return articlesApi.deleteArticle({id})
  },
  onSuccess:(data)=>{
    queryClient.invalidateQueries("articles");
    navigate("/articles")
  
  toast({
    title: "Sukces",
    description: data?.message,
    duration: 3550
  })
  }
})



const deleteArticleHandler = ({id}) => {
  openModal(
    "Are you absolutely sure?",
    "This action cannot be undone. This will permanently delete this article.",
    () => {
      deleteArticleMutation({id})
    }
  );
};

const verifyArticleHandler = ({id,isVerified}) => {

  const modalTitle = !isVerified
  ? "Cofnięcie weryfikacji artykułu"
  : "Potwierdzenie weryfikacji artykułu";

const modalDescription = !isVerified
  ? "Czy na pewno chcesz cofnąć weryfikację tego artykułu? To może wpłynąć na jego wiarygodność."
  : "Czy na pewno chcesz zweryfikować ten artykuł? Zweryfikowany artykuł będzie oznaczony jako wiarygodny.";




  openModal(
    modalTitle,
    modalDescription,
    () => {
     
      
        mutate({id,isVerified})
      
    }
  );
};


const articleDropdownOptions= [
  {label:`${article?.isFavourite ? "Usuń z ulubionych":"Dodaj do ulubionych"}`, icon:<FaStar/>, actionHandler: () => markAsFavouriteHandler({id})},
  {label:"Edytuj", icon:<FaEdit/>, actionHandler: () => console.log("ustawienia")},

  ...(article?.isVerified
    ? [
        {
          label: "Cofnij weryfikację",
        
    
            actionHandler:()=>{
              verifyArticleHandler({ id, isVerified: false })},
          icon: <TiArrowBack />,
          }
      ]
    : [
        {
          label: "Zweryfikuj",
        
   
            actionHandler:()=>{
              verifyArticleHandler({ id, isVerified: true })},
       
          icon: <IoMdCheckmarkCircleOutline />,
        },
      ]),

  // {label:"Zweryfikuj", icon: article?.isVerified ?<IoArrowBackCircleSharp/>:<FaCheckCircle/> , actionHandler:()=>mutate({id, isVerified: true }) },
  {label:"Usuń", icon:<MdDelete/>, actionHandler:()=>{
    deleteArticleHandler({id})
  } },
];



  return (
   
<div className='p-9 grid grid-cols-[1fr_407px] gap-4'>
  {/* LEFT SIDE */}
  <div className='flex flex-col space-y-3.5'>
    <Skeleton>
      <div className='border py-6 px-5 rounded-md flex items-center justify-between'/>
    </Skeleton>

    <Skeleton>
      <Accordion type="multiple" collapsible defaultValue={['item-1']} className='border rounded-md px-7 py-1 '>
        <AccordionItem value="item-1" className='border-0 '>
          <AccordionTrigger className='text-lg text-transparent'></AccordionTrigger>
          <AccordionContent className='break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base '></AccordionContent>
        </AccordionItem>
      </Accordion>
    </Skeleton>

    <Skeleton>
      <Accordion type="multiple" collapsible defaultValue={['item-1']} className='border rounded-md px-7 py-1 '>
        <AccordionItem value="item-1" className='border-0 '>
          <AccordionTrigger className='text-lg text-transparent'></AccordionTrigger>
          <AccordionContent className='break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base min-h-[560px]'>
    
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Skeleton>
  </div>

  {/* RIGHT SIDE */}
  <div className=' overflow-hidden'>
    <Skeleton>
      <div className='min-h-[300px] flex items-center justify-center'>
       
      </div>
    </Skeleton>
  </div>
</div>

 
  )
}

export default ArticleDetailsSkeleton