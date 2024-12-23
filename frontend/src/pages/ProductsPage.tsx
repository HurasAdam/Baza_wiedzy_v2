import AddProduct from '@/components/AddProduct';
import { ColorPicker } from '@/components/ColorPicker';
import EditProduct from '@/components/EditProduct';
import ProductForm from '@/components/forms/ProductForm';
import { Button } from '@/components/ui/button';
import { useModalContext } from '@/contexts/ModalContext';
import { toast } from '@/hooks/use-toast';
import { productsApi } from '@/lib/productsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { AiFillProduct } from "react-icons/ai";
import { MdDelete, MdEdit } from 'react-icons/md';

const ProductsPage = () => {

  const {openContentModal,openModal} = useModalContext()
const queryClient = useQueryClient();

const {data:products = []} = useQuery({
    queryFn:()=>{
        return productsApi.getAllProducts()
    },
    queryKey:["products"]
});


const { mutate: deleteProductMutation } = useMutation({
  mutationFn: (id) => {
    return productsApi.deleteProduct(id);
  },
  onSuccess: () => {
    queryClient.invalidateQueries("products");
    toast({
      title: "Sukces",
      description: "Produkt został usunięty pomyślnie",
      variant: "success",
      duration: 3400,
    });
  },
  onError: (error) => {
    if (error?.status ===404) {
   
        toast({
          title: "Błąd",
          description: "Produkt, który próbujesz usunąć, nie został znaleziony.",
          variant: "destructive",
          duration: 4000,
        });
    }
      else if(error?.status ===409){
        toast({
          title: "Błąd",
          description:
            "Nie można usunąć produktu ponieważ jest on powiązany z jednym lub większą liczbą tematów rozmów.",
          variant: "warning",
          duration: 4000,
        });
      }
      else{
        toast({
          title: "Błąd",
          description: "Wystąpił błąd. Spróbuj ponownie.",
          variant: "destructive",
          duration: 3400,
        });
    }
  
  },
  
});

const deleteProduct = (id) => {
  openModal(
    "Czy jestes pewien?",
    "Czy jesteś pewien, że chcesz usunąć wybrany produkt? Potwierdź, aby kontynuować.",
    () => {
      deleteProductMutation(id)
    }
  );
};


return (
    <div className="flex flex-col gap-1 px-10 py-3 ">
      <div className="px-0.5 pt-2 mb-10 flex items-center gap-2 justify-between ">
        <h2 className='text-xl font-bold text-gray-600 flex items-center gap-2 '><AiFillProduct className="text-blue-900"/>Lista Produktów</h2>
       <div className=' mx-5 '>
       <Button 
   onClick={()=>{
    openContentModal(
      {size:"sm",
        title:"Dodaj produkt", 
        description:"Wypełnij wymagane dane i zatwierdź, aby dodać nowy produkt", 
        content:(<AddProduct/>),
        closeOnOutsideClick:false,
        })
   }}
       className='rounded-lg bg-blue-600 text-white font-semibold py-2'

       >Dodaj nowy produkt</Button>
       </div>
      </div>

  
  <div className='flex flex-col gap-4   '>
    {products&& products?.map((tag)=>{
        return(
            <div 
            key={tag?._id}
            className='border 2xl:w-[45%] px-4 py-2.5  border-gray-400/70 shadow-xs rounded-xl'
       
            >
             <div className='flex justify-between'>
      
             <div className='flex items-center gap-2 font-semibold text-gray-700/90'>
             <div 
                        style={{ backgroundColor: tag?.labelColor }} 
                    className='w-3.5 h-3.5 rounded-sm bg-orange-200'></div>
             {tag?.name}</div>
<div className='flex items-center gap-4'>
<MdEdit 
  onClick={()=>openContentModal(
    {size:"sm",
      title:"Dodaj nowy temat rozmowy", 
      content:( tag && <EditProduct productId={tag?._id}/>),
      closeOnOutsideClick:false,
    })}

           className='w-5 h-5 cursor-pointer text-gray-600/90 hover:text-blue-300'
     
           />

<MdDelete 

className='text-rose-600/60 cursor-pointer hover:text-rose-500'
onClick={()=>deleteProduct(tag?._id)}
/>

</div>

             </div>
            </div>
        )
    })}
  </div>








    </div>
  )
}

export default ProductsPage