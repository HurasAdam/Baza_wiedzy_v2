import React from 'react';
import { FaStar } from "react-icons/fa6";
import { IoCheckmarkCircle } from "react-icons/io5";
import { LuInspect } from "react-icons/lu";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import BadgeLabel from './core/BadgeLabel'
import { useModalContext } from '@/contexts/ModalContext';
import ArticleDetails from '@/pages/ArticleDetails';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import QuickArticleDetails from './QuickArticleDetails';

const ArticleCard = ({data,className,toggleArticleAsFavouriteHandler,isLoading,isSelected}) => {
  const  navigate = useNavigate();
const {openContentModal} = useModalContext();
const articleViewPreference = localStorage.getItem('articleView');

const quickViewArticleHandler = (article,isSelected) => {

    if (articleViewPreference === 'modal') {
    
      openContentModal({
        title: "Edytuj Artykuł",
        description: "Tutaj możesz edytować tytuł, treść oraz inne szczegóły artykułu. Po zakończeniu kliknij `Zapisz zmiany`, aby zastosować aktualizacje.",
        content: <ArticleDetails type="modal" articleId={article._id} />,
        enableOutsideClickClose: true,
        size: "lg",
      });
    } else {
      // Jeśli preferencje użytkownika to "page", przekieruj na nową stronę
      navigate(`/articles/${article._id}`);
    }
  };




  return (
    <Card 
    
    // onClick={() => {
    //   navigate(`/articles/${data._id}`)
    // }}
    className={`${className} ${isSelected ? "bg-slate-100 shadow-lg border-slate-400/80": ""}`}>
        <CardHeader>
            <CardTitle className='text-lg flex justify-between'>
                <span>{data.title}</span>

    <span 
                onClick={(e) => {
                    e.stopPropagation(); // Zatrzymaj propagację, aby nie otwierało artykułu
                    toggleArticleAsFavouriteHandler({ id: data?._id });
                }}
                className=' px-1 flex items-center justify-center border border-transparent rounded-lg hover:border hover:broder hover:border-gray-300/90'>
                    <FaStar
                        
                        className={data?.isFavourite ? "" : "text-gray-200/60"}
                    />
               
                </span>
            
              
  
            </CardTitle>
        
            <CardDescription className='text-xs flex items-center gap-1'>
              
                {data?.isVerified && (
                    <>
                        <IoCheckmarkCircle className='w-4 h-4' />
                        zweryfikowany
                    </>
                )}
            </CardDescription>
        </CardHeader>

        <CardFooter className='space-x-1 flex justify-between'>
      <div className='space-x-1'>
      {data?.tags?.map(({ name }) => (
                <BadgeLabel className="rounded-md bg-slate-200" key={name} variant="secondary" label={name} />
            ))}
      </div>
      <Button
    
      variant="outline"
      onClick={(e)=>{
        e.stopPropagation();
        openContentModal({
              
              
          content: <QuickArticleDetails type="modal" articleId={data._id} />,
          enableOutsideClickClose: true,
          size: 'md'
        });
      }}
      >Zobacz</Button>
        </CardFooter>
       
    </Card>
);
}

export default ArticleCard