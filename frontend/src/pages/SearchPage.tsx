import ArticleCard from '@/components/ArticleCard'
import { MultiSelect } from '@/components/ui/multiSelect'
import { articlesApi } from '@/lib/articlesApi'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'


import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
import { SearchBar } from '@/components/SearchBar'

const frameworksList = [
  { value: "react", label: "React", icon: Turtle },
  { value: "angular", label: "Angular", icon: Cat },
  { value: "vue", label: "Vue", icon: Dog },
  { value: "svelte", label: "Svelte", icon: Rabbit },
  { value: "ember", label: "Ember", icon: Fish },
];

const SearchPage = () => {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);

const {data} = useQuery({
  queryKey:["articles"],
  queryFn:()=>{
    return articlesApi.getAllArticles()
  }
})

console.log(data)

  return (
<div className='grid grid-cols-[3fr_11fr] gap-5 py-6'>

<div className='border px-6 py-5 rounded '>
  <SearchBar/>
</div>


<div className='flex flex-col gap-2'>
      {data?.map((article)=>{
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

export default SearchPage