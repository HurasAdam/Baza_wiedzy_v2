import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { conversationTopicApi } from '@/lib/conversationTopicsApi'
import { useQuery } from '@tanstack/react-query'
import { PiPhoneCallFill } from "react-icons/pi";
import React from 'react'
import ConversationReportCard from '@/components/ConversationReportCard';


export interface ITopic{
  _id:string;
  title:string;
  createdBy:string;
  __v:number;
}


const CallRegister = () => {
  const { data: conversationTopics=[] } = useQuery({
    queryKey: ["conversationTopics"],
    queryFn: () => {
      return conversationTopicApi.getConversationTopics()
    }
  })

  return (
    <div className=' p-3 '>
      <h2 className='flex gap-1 items-center mb-10'>
        <PiPhoneCallFill className='w-6 h-6 text-slate-700'/>
        <span className='text-xl font-semibold text-slate-700'>Rejestr tematów rozmów</span>
        </h2>
      {/* Mapa po tematach */}
      <div className='flex flex-col gap-3.5'>
      {conversationTopics?.map((topic:ITopic) => {
        return (
<ConversationReportCard topic={topic}/>
        )
      })}
      </div>
    </div>
  )
}

export default CallRegister
