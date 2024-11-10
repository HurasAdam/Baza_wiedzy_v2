import ArticleCard from '@/components/ArticleCard'
import { MultiSelect } from '@/components/ui/multiSelect'
import { articlesApi } from '@/lib/articlesApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TbTable } from "react-icons/tb";
import { BiCard } from "react-icons/bi";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
import { SearchBar } from '@/components/SearchBar'
import useArticleFilters from '@/hooks/useArticleFilters'
import { toast } from '@/hooks/use-toast'
import ArticleDetails from './ArticleDetails'
import { useModalContext } from '@/contexts/ModalContext'
import { DataTable } from '@/components/core/DataTable'
import { Button } from '@/components/ui/button'
import QuickArticleDetails from '@/components/QuickArticleDetails'
import QuickViewSection from '@/components/QuickViewSection'

const frameworksList = [
  { value: "react", label: "React", icon: Turtle },
  { value: "angular", label: "Angular", icon: Cat },
  { value: "vue", label: "Vue", icon: Dog },
  { value: "svelte", label: "Svelte", icon: Rabbit },
  { value: "ember", label: "Ember", icon: Fish },
];

const SearchPage = () => {
  const [selectedView,setSelectedView] = useState("grid")
  const [selectedArticle, setSelectedArticle] = useState("");
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

const toggleView = (view)=>{
setSelectedView(view)
}


const handleCloseQuickView= () =>{
  setSelectedArticle(null)
}

const viewOptions = [

  { label: "grid", onClick: () => toggleView("grid"), icon:BiCard },
  { label: "table", onClick: () => toggleView("table"), icon:TbTable }
]

  return (
    <div className=''>

<div className='grid grid-row  xl:grid-cols-[13fr_16fr] gap-5  px-4 '>

<div className='flex     justify-end '>
  <div className='flex bg-white rounded-lg h-fit '>
{viewOptions.map((item)=>{
  const isSelected = item.label ===selectedView
  return(
    <div
    onClick={item.onClick}
    className={isSelected ? "bg-blue-200/50 rounded-lg px-3 cursor-pointer flex items-center ":"px-3 py-2.5 rounded-lg  flex items-center cursor-pointer"}
    >
      <item.icon className='w-4 h-4'/>
      </div>
  )
})}
</div>
  </div>

<div className='flex justify-end  '>
<Button className=' bg-blue-900/90 '>Nowy artykuł</Button>
</div>

</div>



    
{selectedView ==="grid" && (<div className='grid grid-row  xl:grid-cols-[13fr_16fr] gap-4 py-6 min-h-screen px-3   '>




<div className='flex flex-col gap-1.5 overflow-y-auto'>

      {articles?.data?.map((article)=>{
        return(
          <div
  onClick={()=>setSelectedArticle(article._id)}
          className={`min-w-[100%] mx-auto  cursor-pointer  `}
        >
          <ArticleCard
            isLoading={isLoading}
            toggleArticleAsFavouriteHandler={toggleArticleAsFavouriteHandler}
            data={article}
            className=""
            isSelected={selectedArticle === article._id}
          />
      
        </div>
        )
      })}
    </div>





    {/* <div className='border  px-6 pt-5 pb-9 rounded-lg max-h-fit sticky top-[5px] lg:top-[70px] bg-white'>
  <SearchBar/>
</div> */}
{ <QuickViewSection 
onClose={handleCloseQuickView}
articleId={selectedArticle}/>}

</div>)}


{selectedView ==="table" && (
      <div className=' grid grid-cols-[10fr_3fr] gap-3.5'>
        <div className='bg-white p-4 rounded-xl shadow'>
        <DataTable
data={articles?.data}
/>
        </div>

<div className='border  px-6 pt-5 pb-9 rounded-lg max-h-fit sticky top-[5px] lg:top-[70px] bg-white min-h-[84vh]'>
  <SearchBar/>
</div>
      </div>
    )
}

</div>
  )
}

export default SearchPage