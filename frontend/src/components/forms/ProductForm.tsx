import React, { useEffect } from 'react'
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
import { toast } from '@/hooks/use-toast';


interface IProductFormProps{
  productId?:string
}

const ProductForm:React.FC<IProductFormProps> = ({productId}) => {
  const {closeContentModal} = useModalContext()
  const [selectedColor, setSelectedColor] = React.useState('#475569');
const queryClient = useQueryClient();


    const {data:product}= useQuery({
        queryKey:["product", productId],
        queryFn:()=>{
          return productsApi.getProduct(productId)
        },
        enabled: !!productId
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
      



      
    useEffect(() => {
        if (product) {
          form.reset({
            name: product?.name || '',
           
          });
          setSelectedColor(product?.labelColor)
        }
      }, [product, form.reset]);




const {mutate} = useMutation({
  mutationFn:(formData)=>{
    return productsApi.createProduct(formData)
  },
  onSuccess:()=>{
    closeContentModal()
    queryClient.invalidateQueries("products");
    toast({
      title: "Sukces",
      description:"Dodano nowy produkt" ,
      variant:"success",
      duration: 3400
    })
  },
  onError:(error)=>{
  
    if (error?.status === 409) {
        // Jeśli kod błędu to 409, ustaw błąd w polu "name"
        form.setError("name", {
          message: "Produkt o podanej nazwie już istnieje  (nazwa produktu musi być unikalna)", // Wiadomość dla użytkownika
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

const {mutate:updateProductMutation} = useMutation({
  mutationFn:({productId,formData})=>{
    return productsApi.updateProduct(productId,formData)
  },
  onSuccess:()=>{
    closeContentModal()
    queryClient.invalidateQueries("products");
       toast({
            title: "Sukces",
            description:"Produkt został zaktualizowany" ,
            variant:"success",
            duration: 3400
          })
  },
  onError:(error)=>{
  
      if (error?.status === 409) {
          // Jeśli kod błędu to 409, ustaw błąd w polu "name"
          form.setError("name", {
            message: "Produkt o podanej nazwie już istnieje  (nazwa produktu musi być unikalna)", // Wiadomość dla użytkownika
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
    if(productId){
      return updateProductMutation({productId,formData:values})
    }
       mutate(values)
      }

      const colorOptions = [
        { value: '#5d6d7e', label: 'Zgaszony błękitny' },
        { value: '#a0aec0', label: 'Szaro-niebieski' },
        { value: '#6b8e23', label: 'Zgaszona zieleń' },
        { value: '#9b7fbf', label: 'Stonowany fioletowy' },
        { value: '#d1d5db', label: 'Delikatny szary' },
        { value: '#d4c68d', label: 'Zgaszona żółć' },
        { value: '#b94b47', label: 'Przygaszona czerwień' },
    
        // Nowe kolory
        { value: '#3b5b74', label: 'Głęboki morski niebieski' },
        { value: '#889696', label: 'Szaro-zielonkawy' },
        { value: '#8f9779', label: 'Szałwia' },
        { value: '#c2a3c9', label: 'Rozmyty liliowy' },
        { value: '#ece8e1', label: 'Jasny beżowy' },
        { value: '#bc8f8f', label: 'Przygaszony róż' },
        { value: '#807d6e', label: 'Ciemny piaskowy' },
        { value: '#556b2f', label: 'Oliwkowa zieleń' },
        { value: '#6e514c', label: 'Ciepły brązowawy' },
        { value: '#a3c1ad', label: 'Stonowany miętowy' },
        { value: '#b3cde0', label: 'Rozmyty błękit' },
        { value: '#9a879d', label: 'Przybrudzony lawendowy' },
        { value: '#cdb79e', label: 'Pastelowy beżowo-różowy' },
        { value: '#deb887', label: 'Zgaszony bursztynowy' },
        { value: '#e0cda9', label: 'Blady złoty' },
    ];
              
         
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
        <ColorPicker  value={selectedColor} onChange={(color)=>{handleSelectColor(color)}} items={colorOptions}/>
        </div>
              <div className="flex justify-end gap-3 py-10">
          <Button 
              variant="ghost"
              className="hover:bg-gray-200"
                // onClick={resetFiltersHandler}
                type="button">Anuluj</Button>
              
           
                
                
            <Button 
               
                type="submit">{productId ? "Aktualizuj" :"Dodaj produkt"}</Button>
              </div>
                </form>
         
          )
  
}

export default ProductForm;