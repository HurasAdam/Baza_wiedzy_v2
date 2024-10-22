import { ArticleForm } from '@/components/ArticleForm'
import { ToastBox } from '@/components/core/ToastBox'
import { toast } from '@/hooks/use-toast'
import { articlesApi } from '@/lib/articlesApi'
import { tagsApi } from '@/lib/tagsApi'
import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const CreateArticle = () => {
const navigate = useNavigate();

  const {data}= useQuery({
    queryKey:["tags"],
    queryFn:()=>{
      return tagsApi.getAllTags()
    }
  })





const {mutate}= useMutation({
  mutationFn:({formData})=>{
    return articlesApi.createArticle({formData})
  },
  onSuccess:()=>{
    navigate("/articles")
    toast({
      title: "Scheduled: Catch up",
      description: "Friday, February 10, 2023 at 5:57 PM",
      duration: 4000
    })
  }
})

const onSave = ({formData})=>{
  return mutate({formData})
}

const formatedTags = data?.map((tag) => {
  return { label: tag.name, value: tag._id };
});

  return (
    <div>
  {      formatedTags && <ArticleForm 
  onSave={onSave} 
  tags={formatedTags}
  className="2xl:w-[1120px]"
  />}
 
    </div>
  )
}

export default CreateArticle