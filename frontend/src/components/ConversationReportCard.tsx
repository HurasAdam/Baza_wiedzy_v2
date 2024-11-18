import React, { useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { ConversationReportForm } from './ConversationReportForm'
import { useMutation } from '@tanstack/react-query'
import { conversationReportApi } from '@/lib/conversationReportsApi'

const ConversationReportCard = ({topic}) => {

    const [isFormDisabled, setIsFormDisabled] = useState(false);
const {mutate,isLoading} = useMutation({
    mutationFn:(formData)=>{
        return(
            conversationReportApi.sendConversationReport(formData)
        )
    },
    onSuccess:() => {
        // Po wysłaniu danych, zablokuj formularz na 2 sekundy
        setIsFormDisabled(true);
        setTimeout(() => {
          setIsFormDisabled(false); // Po 2 sekundach, włącz formularz z powrotem
        }, 2000);
      },
})


    const onSave = (formData) =>{
        console.log("DANE")
        console.log(formData)
        mutate(formData)
    }


  return (
    <div className="border rounded-lg p-5 grid grid-cols-2 max-w-6xl  gap-4  bg-white shadow-xs">
    {/* Kolumna z tytułem tematu */}
    <div className="flex-1">
      <h3 className="text-lg font-semibold">{topic?.title}</h3>
    </div>

   <ConversationReportForm 
   isFormDisabled={isFormDisabled}
isLoading={isLoading}
   onSave={onSave}
   topic={topic}/>

  </div>
  )
}

export default ConversationReportCard