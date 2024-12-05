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
import { ColorPicker } from '../ColorPicker';

const ProductForm = () => {
  const {closeContentModal} = useModalContext()
  const [selectedColor, setSelectedColor] = React.useState('#000000');
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


      const handleSelectColor = (selected) => {
  
          form.setValue("labelColor",selected)
        }


    const form = useForm({
   
        defaultValues: {
            name: "",
            labelColor:""
         
           
        },
      })
      

const {mutate} = useMutation({
  mutationFn:(formData)=>{
    return productsApi.createProduct(formData)
  },
  onSuccess:()=>{
    closeContentModal()
    queryClient.invalidateQueries(["coversationTopics"]);
  }
})


      function onSubmit(values) {
    console.log(values)
       mutate(values)
      }


    return (
        <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 px-0.5  ">
 
        
        
        
   
         
   
        
        <div className="space-y-1.5 relative ">
            <label htmlFor=""className="text-sm text-gray-500" >
              Nazwa produktu 
            </label>
          
      

<Input 
  {...form.register("name",{required:"nazwa produktu jest wymagana"})}
                     className="pl-4 placeholder:text-gray-600"
                value={form.watch("name")}
                placeholder="wprowadź pełną nazwe produktu" 
             
                />

                 {
                 form.formState.errors.name && (
                    <span className='text-sm text-red-500 mx-1.5'>
                        {form.formState.errors.name?.message}
                    </span>
                 )
                 
                 }
      
        
        </div> 
        <div className='flex items-center  '>
        <label htmlFor=""className="text-sm text-gray-500" >
             Kolor etykiety
            </label>
        <ColorPicker  value={selectedColor} onChange={(color)=>{handleSelectColor(color)}} items={[{value:'#e11d48', label:''}, {value:'#db2777', label:''}, {value:'#c026d3', label:''}, {value:'#9333ea', label:''}, {value:'#4f46e5', label:''}, {value:'#0284c7', label:''}, {value:'#0d9488', label:''}, {value:'#059669', label:''}, {value:'#16a34a', label:''}, {value:'#ca8a04', label:''}, {value:'#ea580c', label:''}, {value:'#dc2626', label:''}, {value:'#000000', label:''}, {value:'#ffffff', label:''}]}/>
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

export default ProductForm;