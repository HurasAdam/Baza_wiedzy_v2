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
   
<div className="min-h-screen px-6 pb-6 flex flex-col space-y-6">
  {/* Top Bar Skeleton */}
  <div className="flex items-center px-6 space-x-3">
    <Skeleton 
     animation='none'
    className="w-10 h-10 rounded-full" />
    <Skeleton 
     animation='none'
    className="w-32 h-6 rounded-md animate-nonne" />
  </div>

  {/* Main Content Skeleton */}
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    {/* Left Column (Details Section) */}
    <div className="md:col-span-2 flex flex-col space-y-6">
      {/* Banner Section */}
      <Skeleton 
       animation='none'
      className="w-full h-40 rounded-md " />
      <div className="flex space-x-4 px-6">
        <Skeleton 
         animation='none'
        className="w-24 h-24 rounded-lg " />
        <Skeleton 
         animation='none'
        className="w-32 h-8 rounded-md " />
      </div>
      <Skeleton 
       animation='none'
      className="w-full h-10 rounded-md px-6 " />
      {/* Tags Section */}
      <div className="flex flex-wrap gap-2">
        {[...Array(4)].map((_, index) => (
          <Skeleton 
           animation='none'
          key={index} className="w-20 h-6 rounded-lg " />
        ))}
      </div>
      {/* Accordions */}
      <Skeleton 
      animation='none'
      className="w-full h-28 rounded-lg " />
      <Skeleton 
       animation='none'
      className="w-full h-56 rounded-lg " />
    </div>

    {/* Right Sidebar */}
    <div className="sticky top-16 space-y-6">
      <Skeleton
       animation='none'
      className="w-full h-96 rounded-lg " />
      <Skeleton 
       animation='none'
      className="w-full h-20 rounded-lg " />
      {[...Array(4)].map((_, index) => (
        <Skeleton 
         animation='none'
        key={index} className="w-full h-10 rounded-md " />
      ))}
    </div>
  </div>
</div>


 
  )
}

export default ArticleDetailsSkeleton