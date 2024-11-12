import React from 'react';
import { FaStar } from "react-icons/fa6";
import { IoCheckmarkCircle } from "react-icons/io5";
import { LuInspect } from "react-icons/lu";
import { FaFolderOpen } from "react-icons/fa6";
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
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import QuickArticleDetails from './QuickArticleDetails';

const ArticleCard = ({data,className,toggleArticleAsFavouriteHandler,isLoading,isSelected,viewType}) => {
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




if(viewType ==="grid"){
  return(
    <Card 
    
    className={`${className} ${isSelected ? "bg-indigo-100 shadow-lg relative  border-indigo-200": "relative hover:bg-slate-100 transition-all duration-50"}`}>
        <CardHeader className=' py-1'>
            <CardTitle className='text-sm flex justify-between  '>
              <div className='flex items-center gap-x-1'>
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
        <span>{data.title}</span>
              </div>
               
<Link to={`/articles/${data._id}`}>
<FaFolderOpen className='w-5 h-5 text-blue-950/90 hover:text-slate-500'/>
</Link>
 
  
            </CardTitle>
        
          {/* <CardDescription className='text-xs flex items-center gap-1'>
                        

    
            </CardDescription>  */}
        </CardHeader>

   
       
    </Card>
  )
}



  return (
    <Card 
    
    onClick={(e) => {
      e.stopPropagation();
      quickViewArticleHandler(data,isSelected)
    }}
    className={`${className} ${isSelected ? "bg-indigo-100 shadow-lg relative  border-indigo-200": "relative hover:bg-slate-100 transition-all duration-50"}`}>
        <CardHeader className=' py-1'>
            <CardTitle className='text-sm flex justify-between  '>
              <div className='flex items-center gap-x-1'>
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
        <span>{data.title}</span>
              </div>
               
<Link 
 onClick={(e) => e.stopPropagation()}
to={`/articles/${data._id}`}>
<FaFolderOpen className='w-5 h-5 text-blue-950/90 hover:text-slate-500'/>
</Link>
 
  
            </CardTitle>
        
          {/* <CardDescription className='text-xs flex items-center gap-1'>
                        

    
            </CardDescription>  */}
        </CardHeader>

   
       
    </Card>
);
}

export default ArticleCard