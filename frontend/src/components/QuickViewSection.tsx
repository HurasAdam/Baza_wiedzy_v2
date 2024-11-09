import React from 'react'
import QuickArticleDetails from './QuickArticleDetails'
import { Button } from './ui/button'

const QuickViewSection = ({articleId,onClose}) => {


if(!articleId){
    return(
        <div className='shadow bg-neutral-100 rounded-xl overflow-y-auto min-h-[80vh] max-h-[80vh] sticky top-16 right-0'>
            
            
            No content</div>
    )
}
    
  return (
    <div className='shadow bg-white rounded-xl overflow-y-auto min-h-[80vh] max-h-[80vh] sticky top-16 right-0'>
   <div className='flex justify-end'>
   <Button
   onClick={onClose}
   className='hover:bg-blue-900'
   variant="ghost"
   >X</Button>
   </div>
<QuickArticleDetails articleId={articleId}/>
    </div>
  )
}

export default QuickViewSection