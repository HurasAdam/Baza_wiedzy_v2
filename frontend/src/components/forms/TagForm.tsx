import React, { useEffect } from 'react'
import { IoIosSearch } from 'react-icons/io';
import { Input } from '../ui/input';
import { SelectBox } from '../core/SelectBox';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useModalContext } from '@/contexts/ModalContext';

import { tagsApi } from '@/lib/tagsApi';
import { toast } from '@/hooks/use-toast';

const TagForm = ({tagId}) => {
  const {closeContentModal} = useModalContext()
const queryClient = useQueryClient()


   const {data:tag}= useQuery({
        queryKey:["conversationTopic",tagId],
        queryFn:()=>{
          return tagsApi.getTag({id:tagId})
        },
        enabled: !!tagId
      })




console.log(tag)

    const form = useForm({
        defaultValues: {
            name: tagId ? tag?.name : ""
        },
      })
      

const {mutate} = useMutation({
  mutationFn:(formData)=>{
    return tagsApi.createTag(formData)
  },
  onSuccess:(data)=>{
    closeContentModal()
    queryClient.invalidateQueries(["tags"]);
    toast({
        title: "Sukces",
        description:data?.message ,
        variant:"success",
        duration: 3400
      })
  },
  onError:(error)=>{

    if (error?.status === 409) {
        // Jeśli kod błędu to 409, ustaw błąd w polu "name"
        form.setError("name", {
          message: "Tag o podanej nazwie już istnieje  (nazwa tagu musi być unikalna)", // Wiadomość dla użytkownika
        });
      } else {
        // Obsługa innych błędów
        toast({
          title: "Błąd",
          description: "Wystąpił błąd. Spróbuj ponownie.",
          variant: "destructive",
          duration: 3400,
        });
      }
  }
})


    useEffect(() => {
        if (tag) {
          form.reset({
            name: tag.name || '',
           
          });
        }
      }, [tag, form.reset]);


const {mutate:updateTagMutation} = useMutation({
  mutationFn:({id,formData})=>{
    return tagsApi.updateTag({id,formData})
  },  onSuccess:()=>{
    closeContentModal()
    queryClient.invalidateQueries(["tags"]);
    toast({
      title: "Sukces",
      description:"Tag został zaktualizowany pomyślnie",
      variant:"success",
      duration: 3400
    })
  },
  onError:(error)=>{

    if (error?.status === 409) {
        // Jeśli kod błędu to 409, ustaw błąd w polu "name"
        form.setError("name", {
          message: "Tag o podanej nazwie już istnieje  (nazwa tagu musi być unikalna)", // Wiadomość dla użytkownika
        });
      } else {
        // Obsługa innych błędów
        toast({
          title: "Błąd",
          description: "Wystąpił błąd. Spróbuj ponownie.",
          variant: "destructive",
          duration: 3400,
        });
      }
  }
})



      function onSubmit(values) {

        if(tagId){
          return updateTagMutation({id:tagId,formData:values})
        }
       mutate(values)
      }

     
         
    return (
        <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 px-0.5  ">
 
        

         
   
        
        <div className="space-y-1.5 relative ">
            <label htmlFor=""className="text-sm text-gray-500" >
              Nazwa tagu 
            </label>
          
      

<Input 
  {...form.register("name",{required:"nazwa tagu jest wymagana",     minLength: {
    value: 2,
    message: "Nazwa tagu musi mieć co najmniej 2 znaki",
},})}
                     className="pl-4 placeholder:text-gray-600"
                value={form.watch("name")}
                placeholder="wprowadź pełną nazwe tagu" 
             
                />

                 {
                 form.formState.errors.name && (
                    <span className='text-sm text-red-500 mx-1.5'>
                        {form.formState.errors.name?.message}
                    </span>
                 )
                 
                 }
      
        
        </div> 

              <div className="flex justify-end gap-3 py-10">
          <Button 
              variant="ghost"
              className="hover:bg-gray-200"
                onClick={closeContentModal}
                type="button">Anuluj</Button>
              
           
                
                
            <Button 
               
                type="submit">{tagId ? "Aktualizuj" :"Dodaj tag"}</Button>
              </div>
                </form>
         
          )
  
}

export default TagForm;