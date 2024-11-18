import { conversationReportApi } from '@/lib/conversationReportsApi'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const StatisticsPage = () => {

const {data} = useQuery({
  queryKey:["reportStatistics"],
  queryFn:()=>{
    return conversationReportApi.getCoversationReportStats()
  }
})
console.log(data)
  return (
    <div>StatisticsPage</div>
  )
}

export default StatisticsPage