import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { conversationTopicApi } from '@/lib/conversationTopicsApi'
import { useQuery } from '@tanstack/react-query'
import { PiPhoneCallFill } from "react-icons/pi";
import React from 'react'

const CallRegister = () => {
  const { data: conversationTopics } = useQuery({
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
      {conversationTopics?.map((topic) => {
        return (
          <div className="border rounded-lg p-5 grid grid-cols-2 max-w-6xl  gap-4  bg-white shadow-xs">
          {/* Kolumna z tytułem tematu */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{topic?.title}</h3>
          </div>
    
          {/* Kolumna z polem tekstowym i przyciskiem */}
          <div>
            <Textarea
           
           
              placeholder="Wpisz opis tematu..."
              className="w-full mb-2"
            />
      <div className='flex justify-end'>
      <Button
        
        className="mt-2 bg-blue-500 text-white p-5  rounded-md w-fit"
      >
        Wyślij
      </Button>
      </div>
          </div>
        </div>
        )
      })}
      </div>
    </div>
  )
}

export default CallRegister
