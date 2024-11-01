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
import { useAlertModal } from '@/hooks/useAlertModal';
import { useModalContext } from '@/contexts/ModalContext';
import ArticleDetailsSkeleton from '@/components/ArticleDetailsSkeleton';
import { ArticleForm } from '@/components/ArticleForm';
import EditArticle from './EditArticle';

const ArticleDetails = ({articleId,type}) => {
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
    "Are you absolutely sure?",
    "This action cannot be undone. This will permanently delete this article.",
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


if(isFetching && !isLoading){
  return (
    <div className=' p-9 flex flex-col-reverse  2xl:grid  2xl:grid-cols-[5fr_2fr] gap-4'>
    {/* LEFT SIDE */}
    <div className=' flex flex-col space-y-3.5  '>
    <div className=' py-3.5 px-5  flex items-center justify-between rounded-xl bg-neutral-50 shadow '>
    <span className='text-2xl'>{article?.title}</span>
    {article?.isFavourite &&<FaStar className='w-5 h-5'/>}
    </div>
    
    
    <Accordion type="multiple" collapsible defaultValue={['item-1']} className='rounded-xl bg-neutral-50 shadow   px-7 py-1 '>
      <AccordionItem value="item-1" className='border-0 '>
        <AccordionTrigger className='text-lg'>Opis dla pracownika</AccordionTrigger>
        <AccordionContent className='break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base  '>
          {article?.employeeDescription}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    
    
    
    
    <Accordion type="multiple" collapsible defaultValue={['item-1']} className='rounded-xl bg-neutral-50 shadow    px-7 py-1 '>
      <AccordionItem value="item-1" className='border-0 '>
        <AccordionTrigger className='text-lg'>Odpowiedź dla klienta</AccordionTrigger>
        <AccordionContent className='break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base min-h-[560px]'>
          {article?.clientDescription}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    
    
    </div>
    
    
    {/* RIGHT SIDE */}
    <div className='border xl:pb-8 xl:px-8 h-fit min-h-[300px] 2xl:sticky top-[75px] rounded-xl bg-neutral-50 shadow  flex flex-col gap-2'>
        <div className='space-y-4'>
    
    {/* TAGS */}
    
    
    <div className='flex justify-end pt-2.5'>
    
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
                <BadgeLabel className="bg-badge_primary" label={tag?.name}/>
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


  return (
    <div className=' p-9 flex flex-col-reverse  2xl:grid  2xl:grid-cols-[5fr_2fr] gap-4'>
{/* LEFT SIDE */}
<div className=' flex flex-col space-y-3.5  '>
<div className=' py-3.5 px-5  flex items-center justify-between rounded-xl bg-neutral-50 shadow '>
<span className='text-2xl'>{article?.title}</span>
{article?.isFavourite &&<FaStar className='w-5 h-5'/>}
</div>


<Accordion type="multiple" collapsible defaultValue={['item-1']} className='rounded-xl bg-neutral-50 shadow   px-7 py-1 '>
  <AccordionItem value="item-1" className='border-0 '>
    <AccordionTrigger className='text-lg'>Opis dla pracownika</AccordionTrigger>
    <AccordionContent className='break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base  '>
      {article?.employeeDescription}
    </AccordionContent>
  </AccordionItem>
</Accordion>




<Accordion type="multiple" collapsible defaultValue={['item-1']} className='rounded-xl bg-neutral-50 shadow    px-7 py-1 '>
  <AccordionItem value="item-1" className='border-0 '>
    <AccordionTrigger className='text-lg'>Odpowiedź dla klienta</AccordionTrigger>
    <AccordionContent className='break-words break-all whitespace-pre-wrap pt-4 pb-10 text-base min-h-[560px]'>
      {article?.clientDescription}
    </AccordionContent>
  </AccordionItem>
</Accordion>


</div>


{/* RIGHT SIDE */}
<div className='border xl:pb-8 xl:px-8 h-fit min-h-[300px] 2xl:sticky top-[75px] rounded-xl bg-neutral-50 shadow  flex flex-col gap-2'>
    <div className='space-y-4'>

{/* TAGS */}


<div className='flex justify-end pt-2.5'>

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
            <BadgeLabel className="bg-badge_primary" label={tag?.name}/>
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