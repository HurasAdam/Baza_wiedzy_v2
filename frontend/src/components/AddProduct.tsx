import React from 'react'
import ProductForm from './forms/ProductForm'
import { IoIosAddCircle } from 'react-icons/io'

const AddProduct:React.FC = () => {
  return (
    <div>
        <div className='font-title mb-8 flex items-center gap-1'>
            <IoIosAddCircle className='w-8 h-8 text-blue-600 '/>
            <span className='text-xl text-slate-700 '>
            Dodaj produkt
            </span>
            </div>
        <ProductForm/>
    </div>
  )
}

export default AddProduct