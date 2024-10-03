import ArticleCard from '@/components/ArticleCard'
import { articlesApi } from '@/lib/articlesApi'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const SearchPage = () => {


const {data} = useQuery({
  queryKey:["articles"],
  queryFn:()=>{
    return articlesApi.getAllArticles()
  }
})

console.log(data)

  return (
    <div className='space-y-2.5'>
      {data?.map((article)=>{
        return(
          <ArticleCard 
          data={article}
          className="max-w-[70%] mx-auto cursor-pointer "
          />
        )
      })}
    </div>
  )
}

export default SearchPage