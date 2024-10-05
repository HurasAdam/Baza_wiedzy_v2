import { ArticleForm } from '@/components/ArticleForm'
import { articlesApi } from '@/lib/articlesApi'
import { tagsApi } from '@/lib/tagsApi'
import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'

const CreateArticle = () => {


  const {data}= useQuery({
    queryKey:["tags"],
    queryFn:()=>{
      return tagsApi.getAllTags()
    }
  })



const formatedTags = data?.map((tag)=>{
  return {label:tag.name, value:tag._id}
})
console.log(formatedTags)

const {mutate}= useMutation({
  mutationFn:({formData})=>{
    return articlesApi.createArticle({formData})
  }
})

const onSave = ({formData})=>{
  return mutate({formData})
}

  return (
    <div>
  {      formatedTags && <ArticleForm onSave={onSave} tags={formatedTags}/>}
    </div>
  )
}

export default CreateArticle