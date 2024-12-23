import React from 'react'
import TagForm from './forms/TagForm'
import { IoIosAddCircle } from "react-icons/io";
const AddTag = ({tagId}) => {
  return (
    <div>
        <div className='font-title mb-8 flex items-center gap-1'>
            <IoIosAddCircle className='w-8 h-8 text-blue-600 '/>
            <span className='text-xl text-slate-700 '>
            Dodaj nowy tag
            </span>
            </div>
        <TagForm tagId={tagId}/>
    </div>
  )
}

export default AddTag