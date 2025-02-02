import { IMAGES } from '@/constants/images';
import React, { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { formatDate } from '@/lib/utils';
import { FaFileSignature } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { articlesApi } from '@/lib/articlesApi';
import UserCreatedArticleDetails from './UserCreatedArticleDetails';

const UserArticlesDetails = ({userId,queryParams}) => {
 const [selectedItem, setSelectedItem] = useState(null);

const {data:userArticles} = useQuery({
    queryKey:["articlesCreatedByUser",userId],
    queryFn:()=>{
        return articlesApi.getArticlesCreatedByUser({userId,searchParams:queryParams})
    }
})

const handleSelectItem = (itemId) => {
    setSelectedItem(itemId);
  };

console.log("selectedItem")
console.log(selectedItem)
  return (
    <div className="grid grid-cols-[6fr_14fr] h-full gap-1.5 max-h-full">
      {/* Lewa kolumna - lista zmian */}
      <div className="border-r overflow-y-auto max-h-[88vh] scrollbar-custom   ">
      <ul className="p-2 space-y-2">
          {userArticles?.map((article) => (
            <li
              key={article._id}
              className={`p-3 rounded-lg cursor-pointer shadow-sm border ${
                selectedItem === article._id ? 'bg-blue-100 border-blue-500' : 'bg-white'
              }`}
              onClick={() => handleSelectItem(article._id)}
            >
              <div className="font-semibold text-gray-800">{article.title}</div>
              <div className={`text-sm ${article.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                {article.isVerified ? 'Zweryfikowany' : 'Niezweryfikowany'}
              </div>
              <div className="text-sm text-gray-500">{formatDate(article.createdAt)}</div>
            </li>
          ))}
        </ul>
     
      </div>

      {/* Prawa kolumna - może być pusta */}
      <div className=" overflow-y-auto h-full min-h-[88vh]  break-words w-full box-border scrollbar-custom ">
 
  
   <UserCreatedArticleDetails articleId={selectedItem}/>
  
      
      
       
      
      </div>
    </div>
  )
}

export default UserArticlesDetails