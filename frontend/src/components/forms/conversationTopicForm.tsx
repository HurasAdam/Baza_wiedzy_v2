import { useModalContext } from '@/contexts/ModalContext';
import { toast } from '@/hooks/use-toast';
import { conversationTopicApi } from '@/lib/conversationTopicsApi';
import { productsApi } from '@/lib/productsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SelectBox } from '../core/SelectBox';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

const conversationTopicForm = ({topicId}) => {
  const {closeContentModal} = useModalContext()
  const [errorMessage, setErrorMessage] = useState<string>("")
 
const queryClient = useQueryClient();
    const {data:products}= useQuery({
        queryKey:["products"],
        queryFn:()=>{
          return productsApi.getAllProducts()
        }
      })

      const {data:conversationTopic}= useQuery({
        queryKey:["conversationTopic",topicId],
        queryFn:()=>{
          return conversationTopicApi.getConversationTopic({id:topicId})
        },
        enabled: !!topicId
      })




      const formatedProducts = products?.map((product)=>{
        return {label:product.name, value:product?._id}
      })


      const handleProductSelect = (selected) => {
        form.setValue("product", selected, { shouldValidate: true }); // Ustaw wartość
        if (selected) {
          form.clearErrors("product"); // Wyczyść błąd, jeśli wartość została wybrana
        }
      };

    const form = useForm({
   
        defaultValues: {
            title: topicId ? conversationTopic?.title:"",
            product: topicId ? conversationTopic?.product?._id :"",
        },
         mode: "onSubmit"
      })
      

      useEffect(() => {
        if (conversationTopic) {
          form.reset({
            title: conversationTopic.title || '',
            product: conversationTopic.product?._id || '',
          });
        }
      }, [conversationTopic, form.reset]);


const {mutate} = useMutation({
  mutationFn:(formData)=>{
    return conversationTopicApi.createConversationTopic(formData)
  },
  onSuccess:()=>{
    closeContentModal()
    queryClient.invalidateQueries(["coversationTopics"]);
  },
  onError:(error)=>{

    if (error?.status === 409) {
        // Jeśli kod błędu to 409, ustaw błąd w polu "name"
        setErrorMessage("Dla wybranego produktu istnieje już temat o podanej nazwie (temat rozmowy może wystapić tylko raz dla każdego z produktów)")
        
       
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


const {mutate:updateTopicMutation} = useMutation({
  mutationFn:(formData)=>{
    return conversationTopicApi.updateConversationTopic({id:topicId, formData})
  },
  onSuccess:()=>{
    closeContentModal()
    queryClient.invalidateQueries(["coversationTopics"]);
  },
  onError:(error)=>{

    if (error?.status === 409) {
        // Jeśli kod błędu to 409, ustaw błąd w polu "name"
        
          setErrorMessage("Temat o podanej nazwie już istnieje (temat rozmowy musi być unikalny)")
        
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

        if (!values.product) {
          form.setError("product", { type: "manual", message: "Wybierz produkt z listy" }); // Ustaw błąd
          return;
        }


    if(topicId){
      return updateTopicMutation(values)
    }else{
      mutate(values)
    }
      
      }


if(topicId && !conversationTopic){
  return (
    <div>Loading...</div>
  )
}

else{
  return (
    <form 
    onSubmit={form.handleSubmit(onSubmit)}
    className="space-y-8 px-0.5  ">
    <div className="relative ">

    <SelectBox 
    label="Produkt"
 placeholder="Wybierz produkt"
    onChange={handleProductSelect}
    value={form.watch("product")}
    data={formatedProducts}
    />
         {
             form.formState.errors.product && (
                <span className='text-sm text-red-500 mx-1.5'>
                    {form.formState.errors.product?.message}
                </span>
             )
             
             }
    </div>
    
    <div className="space-y-1.5 relative ">
        <label htmlFor=""className="text-sm text-gray-500" >
          Temat 
        </label>
      
        <Textarea
        {...form.register("title",{required:"wprowadź temat rozmowy",minLength:{value:3,message:"temat rozmowy musi zawierac conajmniej 3 znaki"}})}
              placeholder="wprowadź temat rozmowy"
              className=" resize-none min-h-[110px] scrollbar-custom"
             
            />

             {
             form.formState.errors.title && (
                <span className='text-sm text-red-500 mx-1.5'>
                    {form.formState.errors.title?.message}
                </span>
             )
             
             }
  
   <div className='px-2'>
   {errorMessage && <span className='text-sm text-red-500 mx-1.5'>{errorMessage}</span>}
   </div>
    </div> 
    
          <div className="flex justify-end gap-3 py-10">
      <Button 
          variant="ghost"
          className="hover:bg-gray-200"
            // onClick={resetFiltersHandler}
            type="button">Anuluj</Button>
          
       
            
            
        <Button 
           
            type="submit">{topicId ? "Aktualizuj" : "Dodaj temat"}</Button>
          </div>
            </form>
     
      )
}
    
  
}

export default conversationTopicForm