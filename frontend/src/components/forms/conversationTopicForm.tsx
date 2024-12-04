import React from 'react'
import { IoIosSearch } from 'react-icons/io';
import { Input } from '../ui/input';
import { SelectBox } from '../core/SelectBox';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib/productsApi';
import { Textarea } from '../ui/textarea';
import { conversationTopicApi } from '@/lib/conversationTopicsApi';
import { useModalContext } from '@/contexts/ModalContext';

const conversationTopicForm = () => {
  const {closeContentModal} = useModalContext()
 
const queryClient = useQueryClient();
    const {data:products}= useQuery({
        queryKey:["products"],
        queryFn:()=>{
          return productsApi.getAllProducts()
        }
      })

      const formatedProducts = products?.map((product)=>{
        return {label:product.name, value:product?._id}
      })


      const handleProductSelect = (selected) => {
  
          form.setValue("product",selected)
        }


    const form = useForm({
   
        defaultValues: {
            title: "",
            product:"",
         
           
        },
      })
      

const {mutate} = useMutation({
  mutationFn:(formData)=>{
    return conversationTopicApi.createConversationTopic(formData)
  },
  onSuccess:()=>{
    closeContentModal()
    queryClient.invalidateQueries(["coversationTopics"]);
  }
})


      function onSubmit(values) {
    
       mutate(values)
      }


    return (
        <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 px-0.5  ">
 
        
        
        
   
         
        <div className="relative ">
 
        
        <SelectBox 
        label="Produkt"
     placeholder="Wybierz produkt"
        onChange={handleProductSelect}
        // clearAuthorHandler={clearAuthorHandler}
        value={form.watch("product")}
        data={formatedProducts}
        />
        </div>
        
        <div className="space-y-1.5 relative ">
            <label htmlFor=""className="text-sm text-gray-500" >
              Temat 
            </label>
          
            <Textarea
            {...form.register("title",{required:"wprowadź temat rozmowy"})}
                  placeholder="wprowadź temat rozmowy"
                  className=" resize-none min-h-[110px] scrollbar-custom"
                 
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
                // onClick={resetFiltersHandler}
                type="button">Anuluj</Button>
              
           
                
                
            <Button 
               
                type="submit">Dodaj temat</Button>
              </div>
                </form>
         
          )
  
}

export default conversationTopicForm