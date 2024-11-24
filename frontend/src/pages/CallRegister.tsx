import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { conversationTopicApi } from '@/lib/conversationTopicsApi'
import { useQuery } from '@tanstack/react-query'
import { PiPhoneCallFill } from "react-icons/pi";
import React from 'react'
import ConversationReportCard from '@/components/ConversationReportCard';
import { conversationReportApi } from '@/lib/conversationReportsApi';
import { TbReportSearch } from "react-icons/tb";


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


  const { data: conversationReportValues=[] } = useQuery({
    queryKey: ["conversationReports"],
    queryFn: () => {
      return conversationReportApi.getConversationReportValues()
    }
  })

console.log(conversationReportValues)

  return (
    <div className=' grid grid-cols-[5fr_2fr] p-3 gap-4  '>
      <div>
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
      <div className='px-3 pt-12' >
      <h2 className='flex gap-1 items-center '>
        <TbReportSearch className='w-5 h-5 text-slate-700'/>
        <span className='text-lg font-semibold text-slate-700'>Najczęsciej odnotowywane</span>
        </h2>
        <div className=' p-2'>
        <div className=' px-1 grid grid-cols-[6fr_1fr] text-sm font-semibold text-slate-600  rounded-lg my-1 justify-between'>
          <div>Temat</div>
          <div>Ilość</div>
          </div>
      {conversationReportValues?.map((reportTopicItem)=>{
        return(
          <div className='border px-2.5 py-2 grid grid-cols-[6fr_1fr] bg-white rounded-lg my-1 justify-between'>
          <div>{reportTopicItem.topicTitle}</div>
          <div>{reportTopicItem.reportCount}</div>
          </div>
        )
      })}
      </div>
      </div>
    </div>
  )
}

export default CallRegister
