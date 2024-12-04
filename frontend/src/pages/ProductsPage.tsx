import { ColorPicker } from '@/components/ColorPicker';
import { Button } from '@/components/ui/button';
import { useModalContext } from '@/contexts/ModalContext';
import { productsApi } from '@/lib/productsApi';
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { AiFillProduct } from "react-icons/ai";
import { MdDelete, MdEdit } from 'react-icons/md';

const ProductsPage = () => {

  const {openContentModal} = useModalContext()
  const [selectedColor, setSelectedColor] = React.useState('#000000');

const {data:products} = useQuery({
    queryFn:()=>{
        return productsApi.getAllProducts()
    },
    queryKey:["products"]
});


return (
    <div className="flex flex-col gap-1 px-10 py-3 ">
      <div className="px-0.5 pt-2 mb-10 flex items-center gap-2 justify-between ">
        <h2 className='text-xl font-bold text-gray-600 flex items-center gap-2 '><AiFillProduct className="text-blue-900"/>Lista Produktów</h2>
       <div className=' mx-5 '>
       <Button 
   onClick={()=>{
    openContentModal({title:"Dodaj produkt", description:"Wypełnij wymagane dane i zatwierdź, aby dodać nowy produkt", content:(<div>
      <ColorPicker value={selectedColor} onChange={(color)=>{setSelectedColor(color)}} items={[{value:'#e11d48', label:''}, {value:'#db2777', label:''}, {value:'#c026d3', label:''}, {value:'#9333ea', label:''}, {value:'#4f46e5', label:''}, {value:'#0284c7', label:''}, {value:'#0d9488', label:''}, {value:'#059669', label:''}, {value:'#16a34a', label:''}, {value:'#ca8a04', label:''}, {value:'#ea580c', label:''}, {value:'#dc2626', label:''}, {value:'#000000', label:''}, {value:'#ffffff', label:''}]}/>
    </div>)})
   }}
       className='rounded-lg bg-blue-600 text-white font-semibold py-2'

       >Dodaj nowy produkt</Button>
       </div>
      </div>

  
  <div className='flex flex-col gap-4   '>
    {products?.map((tag)=>{
        return(
            <div 
            key={tag?._id}
            className='border 2xl:w-[45%] px-4 py-2.5  border-gray-400/70 shadow-xs rounded-xl'
       
            >
             <div className='flex justify-between'>
             <span className='font-semibold text-gray-700/90'>{tag?.name}</span>
<div className='flex items-center gap-4'>
<MdEdit 
           className='w-5 h-5 cursor-pointer text-gray-600/90 hover:text-blue-300'
     
           />

<MdDelete 
className='text-rose-600/60 cursor-pointer hover:text-rose-500'

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