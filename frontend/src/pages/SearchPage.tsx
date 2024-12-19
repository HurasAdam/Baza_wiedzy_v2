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
import { SiPowerpages } from "react-icons/si";
import { useModalContext } from '@/contexts/ModalContext'
import { DataTable } from '@/components/core/DataTable'
import { HiMiniXMark } from "react-icons/hi2";
import QuickArticleDetails from '@/components/QuickArticleDetails'
import QuickViewSection from '@/components/QuickViewSection'
import { BasicSearchBar } from '@/components/BasicSearchBar'
import useArticleViewType from '@/hooks/useArticleViewType'
import { SideDrawer } from '@/components/core/SideDrawer'
import { IoFilter } from "react-icons/io5";
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import Spinner from '@/components/core/Spinner'
import { IoIosSearch } from 'react-icons/io'

const SearchPage = () => {
  const [selectedView,setSelectedView] = useState("grid")
  const [selectedArticle, setSelectedArticle] = useState("");
  const queryClient = useQueryClient();

  const {title,tags,author,setFilters,page,verified,limit, getActiveFiltersCount} = useArticleFilters();
  const {openContentModal} = useModalContext();
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const activeFiltersCount = getActiveFiltersCount();





const [viewType,updateViewType] = useArticleViewType("articleView","table")

const {debouncedValue} = useDebounce({value:title,delay:250})

  const queryParams={
    page,title:debouncedValue,tags,author,verified,limit
  }


const {data:articles, isLoading:isArticlesLoading} = useQuery({
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
    duration: 3600,
variant:"success"
  })
  }
})

const toggleArticleAsFavouriteHandler = ({id})=>{

  markAsFavouriteHandler({id})
}

const toggleView = (view)=>{
setSelectedView(view)
}


const closeDrawer = () =>{
  setIsDrawerOpen(false)
}

const openDrawer = () =>{
  setIsDrawerOpen(true);
}

const handleCloseQuickView= () =>{
  setSelectedArticle(null)
}

const viewOptions = [

  { label: "grid", onClick: () => updateViewType("grid"), icon:BiCard },
  { label: "table", onClick: () => updateViewType("table"), icon:TbTable }
]

  return (
    <div className=' rounded-lg  min-h-[90vh]'>

<div className='grid grid-row  xl:grid-cols-[13fr_16fr] gap-5  px-4 py-2 relative max-w-[1700px] mx-auto   '>
<div className='font-semibold flex items-center gap-x-1.5 text-2xl text-sky-950'>
  <SiPowerpages/>Baza artykułów
  </div>
<div className='flex     justify-end '>




  <div className='flex bg-white rounded-lg h-fit '>
{viewOptions.map((item)=>{
  const isSelected = item.label ===viewType
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

{/* <div className='flex justify-end  '>
<Button className=' bg-blue-900/90 '>Nowy artykuł</Button>
</div> */}
   
</div>



    
{viewType ==="grid" && (<div className='grid grid-row  xl:grid-cols-[13fr_16fr] gap-4  h-fit px-3  max-w-[1740px] mx-auto  '>




<div className='flex flex-col gap-1.5 px-2  '>
  <div className='flex justify-end px-3 '>
  
  <Button
  variant="outline"
  className={`${activeFiltersCount >0 ? "bg-blue-500 text-neutral-50":"hover:bg-blue-100 rounded-lg text-slate-600 flex items-center gap-x-1.5"} `}
onClick={()=>openContentModal({size:"sm",title:"Filtry", content:(<div className='px-2 '><SearchBar immediate={false}/></div>)})}>
   <IoFilter className='w-4 h-4'/>
{activeFiltersCount > 0 ? `+ ${activeFiltersCount} więcej filtrów` :"więcej filtrów"}

 
</Button>
{activeFiltersCount >0 &&(<Button
  variant="ghost"
  className='hover:bg-transparent'

>
 <HiMiniXMark className='w-5 h-5'/>
</Button>)}
  </div>

<BasicSearchBar 
className="flex items-center w-full justify-between"
visibleFields={{ title: true, tags: false, author: false }} />

{
  isArticlesLoading ? <div  className='py-6 flex flex-col gap-[3px] relative  h-full'>
    <Spinner 
color="border-orange-600"
      className='absolute top-[43%] left-1/2  '
    />

  </div>:
  <div className='py-6 flex flex-col gap-[3px]'>
    
      {
      
      articles?.data.length>0 ?(
      articles?.data?.map((article)=>{
        return(
          <div
  onClick={()=>setSelectedArticle(article._id)}
          className={`min-w-[100%] mx-auto  cursor-pointer   `}
        >
          <ArticleCard
          viewType={selectedView}
            isLoading={isLoading}
            toggleArticleAsFavouriteHandler={toggleArticleAsFavouriteHandler}
            data={article}
            className=""
            isSelected={selectedArticle === article._id}
          />
      
        </div>
        )
      })):(
        <div className='mx-auto flex items-center gap-2 text-gray-500 text-lg mt-36  '>
   <IoIosSearch className='w-8 h-8 text-slate-500'/>
     <span className='text-md  text-slate-500/90 font-semibold'>Nie znaleziono pasujących artykułów ...</span>
 
      </div>
      )}
      </div>}
    </div>



<div className='py-3.5 '>
{ <QuickViewSection 
onClose={handleCloseQuickView}
articleId={selectedArticle}/>}

</div>

</div>)}


{viewType ==="table" && (
      <div className=' grid grid-cols-[13fr_4fr] gap-3.5 px-2.5 py-6 max-w-[1740px] mx-auto  '>

        <div className='py-5 px-5 rounded-xl   space-y-1.5'>
        {/* <DataTable
data={articles?.data}
/> */}
      {articles?.data?.map((article)=>{
        return(
          <div
  onClick={()=>setSelectedArticle(article._id)}
          className={`min-w-[100%] mx-auto  cursor-pointer   `}
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

        <div className='shadow border border-neutral-200  px-6 pt-5 pb-9 rounded-lg max-h-fit sticky top-[5px] lg:top-[70px] bg-white min-h-[84vh]'>
  <SearchBar visibleFields={{ title: true, tags: true, author: true }} immediate={true} />
</div>
      </div>
    )
}
<SideDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
</div>
  )
}

export default SearchPage