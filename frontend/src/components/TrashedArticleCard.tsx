import React from 'react';
import { FaStar } from "react-icons/fa6";
import { IoCheckmarkCircle } from "react-icons/io5";
import { LuInspect } from "react-icons/lu";
import { FaFolderOpen } from "react-icons/fa6";
import { TbArrowBackUp } from "react-icons/tb";
import {
    Card,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { useModalContext } from '@/contexts/ModalContext';
import ArticleDetails from '@/pages/ArticleDetails';
import { Link, useNavigate } from 'react-router-dom';

const TrashedArticleCard = ({data,className,toggleArticleAsFavouriteHandler,isLoading,isSelected,viewType}) => {
  const  navigate = useNavigate();
const {openContentModal} = useModalContext();
const articleViewPreference = localStorage.getItem('articleView');

const quickViewArticleHandler = (article,isSelected) => {

      openContentModal({
        title: article?.title,
        description: "",
        content: <ArticleDetails type="modal" articleId={article._id} />,
        enableOutsideClickClose: true,
        size: "lg",
      });

  };


if(viewType ==="grid"){
  return(
    <Card 
    
    className={`${className} ${isSelected ? "bg-indigo-100 shadow-lg relative  border-indigo-200": "relative hover:bg-slate-100 transition-all duration-50"}`}>
        <CardHeader className=' py-1 pr-5 pl-0'>
            <CardTitle className='text-sm flex justify-between'>
              <div className='flex items-center gap-x-1'>
              <span 
                onClick={(e) => {
                    e.stopPropagation(); // Zatrzymaj propagację, aby nie otwierało artykułu
                    toggleArticleAsFavouriteHandler({ id: data?._id });
                }}
                className=' pl-3.5 p-2 py-0.5 flex items-center justify-center border border-transparent rounded-lg  group'>
                    <TbArrowBackUp
                        
                        className={data?.isFavourite ? "text-slate-900 group-hover:text-blue-200" : "text-gray-300 group-hover:text-blue-300"}
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

export default TrashedArticleCard