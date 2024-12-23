import React from 'react'
import { FiEdit } from 'react-icons/fi'
import ProductForm from './forms/ProductForm'

interface IEditProductProps{
    productId:string
}

const EditProduct:React.FC<IEditProductProps> = ({productId}) => {
  return (
    <div>
        <div className='font-title mb-8 flex items-center gap-1.5'>
            <FiEdit className='w-8 h-8 text-slate-700 '/>
            <span className='text-xl text-slate-700 '>
            Edytuj produkt
            </span>
            </div>
        <ProductForm productId={productId}/>
    </div>
  )
}

export default EditProduct