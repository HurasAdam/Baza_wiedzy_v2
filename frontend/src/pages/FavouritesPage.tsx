import ArticleCard from '@/components/ArticleCard'
import { MultiSelect } from '@/components/ui/multiSelect'
import { articlesApi } from '@/lib/articlesApi'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'



import { SearchBar } from '@/components/SearchBar'
import useArticleFilters from '@/hooks/useArticleFilters'



const FavouritesPage:React.FC = () => {
  const {title,tags,author,setFilters,page,verified,limit} = useArticleFilters();


  const queryParams={
    page,title,tags,author,verified,limit
  }


const {data:articles} = useQuery({
  queryKey:["articles",queryParams],
  queryFn:()=>{
    return articlesApi.getAllArticles(queryParams)
  }
})



  return (
<div className='grid grid-cols-[3fr_11fr] gap-5 py-6 min-h-screen'>

<div className='border px-6 py-5 rounded max-h-[700px] sticky top-[70px] '>
  
  <SearchBar/>
  
</div>


<div className='flex flex-col gap-2'>
      {articles?.data?.map((article)=>{
        return(
      <Link to={`/articles/${article?._id}`} className='min-w-[100%] mx-auto cursor-pointer'>
          <ArticleCard 
          data={article}
          className=""
          />
      </Link>
        )
      })}

    </div>
</div>
  )
}

export default FavouritesPage