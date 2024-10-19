import { ArticleForm } from '@/components/ArticleForm'
import { toast } from '@/hooks/use-toast'
import { articlesApi } from '@/lib/articlesApi'
import { tagsApi } from '@/lib/tagsApi'
import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const EditArticle = ({article}) => {

  const navigate= useNavigate();
    const {data}= useQuery({
        queryKey:["tags"],
        queryFn:()=>{
          return tagsApi.getAllTags()
        }
      })
    

      const {mutate}= useMutation({
        mutationFn:({id,formData})=>{
          return articlesApi.updateArticle({id,formData})
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


      const onSave = ({id,formData})=>{
        return mutate({id,formData})
      }

      const formatedTags = data?.map((tag) => {
        return { label: tag.name, value: tag._id };
      });

  return (
    <div>
        <ArticleForm tags={formatedTags} onSave={onSave} article={article} />
    </div>
  )
}

export default EditArticle