import React from 'react'
import TagForm from './forms/TagForm'
import { FiEdit } from "react-icons/fi";

interface IEditTagProps{
    tagId:string
}

const EditTag:React.FC<IEditTagProps> = ({tagId}) => {
  return (
    <div>
        <div className='font-title mb-8 flex items-center gap-1.5'>
            <FiEdit className='w-8 h-8 text-slate-700 '/>
            <span className='text-xl text-slate-700 '>
            Edytuj tag
            </span>
            </div>
        <TagForm tagId={tagId}/>
    </div>
  )
}

export default EditTag