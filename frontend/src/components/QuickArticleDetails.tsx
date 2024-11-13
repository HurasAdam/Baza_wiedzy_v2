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
import { IoArrowBack } from "react-icons/io5";
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
import { useAlertModal } from '@/hooks/useAlertModal';
import { useModalContext } from '@/contexts/ModalContext';
import ArticleDetailsSkeleton from '@/components/ArticleDetailsSkeleton';
import { ArticleForm } from '@/components/ArticleForm';

import { Button } from '@/components/ui/button';
import EditArticle from '@/pages/EditArticle';

const QuickArticleDetails = ({articleId,type}) => {
    const { id } = useParams();
    const queryClient = useQueryClient();
 const navigate = useNavigate()
    const { openModal, openContentModal } = useModalContext();



const {data:article, isLoading, isFetching} = useQuery({
  
    queryKey:["article",id || articleId],
    queryFn:()=>{
      
          return articlesApi.getArticle({id:id || articleId})
     
    
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
    return articlesApi.markArticleAsFavourite({id:id || articleId})
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
    "Czy jestes pewien?",
    "Czy jesteś pewien, że chcesz usunąć ten artykuł? Potwierdź, aby kontynuować..",
    () => {
      deleteArticleMutation({id:id ||articleId})
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
        mutate({id:id||articleId,isVerified})
    }
  );
};


const EditArticleHandler = (article) =>{
  openContentModal(
    {title:"Edytuj Artykuł", 
      description:"Tutaj możesz edytować tytuł, treść oraz inne szczegóły artykułu. Po zakończeniu kliknij `Zapisz zmiany`, aby zastosować aktualizacje.", 
      content:<EditArticle type={id ? "view" :"modal"} article={article} />,size:"lg" })
}




const articleDropdownOptions= [
  {label:`${article?.isFavourite ? "Usuń z ulubionych":"Dodaj do ulubionych"}`, icon:<FaStar/>, actionHandler: () => markAsFavouriteHandler({id})},
  {label:"Edytuj", icon:<FaEdit/>, actionHandler: () => EditArticleHandler(article)},

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

if(isLoading ){
  return(
    <ArticleDetailsSkeleton/>
  )
}





  return (
    <div className=' px-6  pb-3 py-5 '>
    {/* LEFT SIDE */}
   
    <div className=' flex flex-col space-y-1.5 '>

    <div className='  px-5 mb-2 flex flex-col justify-between rounded-xl  '>
 <div className='flex items-center gap-x-1'>
 {article?.isFavourite &&<FaStar className='w-5 h-5'/>}
 <span className='text-xl font-semibold text-gray-800'>{article?.title}</span>
 </div>

    <div className='py-2.5 px-0.5 space-x-1 space-y-1.5'>
      
      {article?.tags?.map((tag)=>{
          return(
              <BadgeLabel className="bg-badge_primary rounded-lg" label={tag?.name}/>
          )
      })}
  </div>
    </div>
    
    
    <Accordion type="multiple" collapsible defaultValue={['item-1']} className='rounded-xl   px-8 py-1 '>
      <AccordionItem value="item-1" className='border-0 '>
        <AccordionTrigger className='text-lg px-2.5 py-3 bg-blue-50 rounded-lg border border-blue-100 '>Opis dla pracownika</AccordionTrigger>
        <AccordionContent className='break-words break-all whitespace-pre-wrap pt-4 pb-10 text-sm text-gray-900  '>
          {article?.employeeDescription}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    
    
    
    
    <Accordion type="multiple" collapsible defaultValue={['item-1']} className='rounded-xl    px-8 py-1 '>
      <AccordionItem value="item-1" className='border-0 '>
        <AccordionTrigger className='text-lg px-2.5 py-3 bg-blue-50 rounded-lg border border-blue-100'>Odpowiedź dla klienta</AccordionTrigger>
        <AccordionContent className='break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base min-h-[560px] text-sm text-gray-900 '>
          {article?.clientDescription}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    
    
    </div>
    
    
    {/* RIGHT SIDE */}
   
    
        </div>
  )
}

export default QuickArticleDetails