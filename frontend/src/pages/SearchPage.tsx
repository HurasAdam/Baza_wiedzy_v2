import ArticleCard from '@/components/ArticleCard'
import { MultiSelect } from '@/components/ui/multiSelect'
import { articlesApi } from '@/lib/articlesApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
import { SearchBar } from '@/components/SearchBar'
import useArticleFilters from '@/hooks/useArticleFilters'
import { toast } from '@/hooks/use-toast'
import ArticleDetails from './ArticleDetails'
import { useModalContext } from '@/contexts/ModalContext'

const frameworksList = [
  { value: "react", label: "React", icon: Turtle },
  { value: "angular", label: "Angular", icon: Cat },
  { value: "vue", label: "Vue", icon: Dog },
  { value: "svelte", label: "Svelte", icon: Rabbit },
  { value: "ember", label: "Ember", icon: Fish },
];

const SearchPage = () => {
  const {openContentModal} = useModalContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {title,tags,author,setFilters,page,verified,limit} = useArticleFilters();
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);


  const queryParams={
    page,title,tags,author,verified,limit
  }


const {data:articles} = useQuery({
  queryKey:["articles",queryParams],
  queryFn:()=>{
    return articlesApi.getAllArticles(queryParams)
  }
})


const {mutate:markAsFavouriteHandler,isLoading} = useMutation({
  mutationFn:({id})=>{
    return articlesApi.markArticleAsFavourite({id})
  },
  onSuccess:(data)=>{
  queryClient.invalidateQueries(["articles"])
  toast({
    title: "Sukces",
    description: data?.message,
    duration: 3550
  })
  }
})

const toggleArticleAsFavouriteHandler = ({id})=>{

  markAsFavouriteHandler({id})
}


  return (
<div className='grid grid-row  xl:grid-cols-[15fr_4fr] gap-5 py-6 min-h-screen p-6'>




<div className='flex flex-col gap-2'>
      {articles?.data?.map((article)=>{
        return(
          <div
          onClick={() => {
            const articleViewPreference = localStorage.getItem('articleView');
            if (articleViewPreference === 'modal') {
              // Otwórz modal
              openContentModal({
                title: "Edytuj Artykuł",
                description: "Tutaj możesz edytować tytuł, treść oraz inne szczegóły artykułu.",
                content: <ArticleDetails type="modal" articleId={article._id} />,
                enableOutsideClickClose: true,
                size: 'lg'
              });
            } else {
              // Przekieruj na stronę
              navigate(`/articles/${article._id}`);
            }
          }}
          className='min-w-[100%] mx-auto cursor-pointer'
        >
          <ArticleCard
            isLoading={isLoading}
            toggleArticleAsFavouriteHandler={toggleArticleAsFavouriteHandler}
            data={article}
            className=""
          />
        </div>
        )
      })}






    </div>
    <div className='border  px-6 pt-5 pb-9 rounded-lg max-h-fit sticky top-[5px] lg:top-[70px] bg-white'>
  <SearchBar/>
</div>


</div>
  )
}

export default SearchPage