import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { conversationReportApi } from "@/lib/conversationReportsApi";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { HiMiniPresentationChartBar } from "react-icons/hi2";
import { DatePicker } from "@/components/DatePicker";

const StatisticsPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { data: usersWithStats } = useQuery({
    queryKey: ["reportStatistics"],
    queryFn: () => {
      return conversationReportApi.getCoversationReportStats();
    },
  });

  return (
    <div className="min-w-[1580px] mx-auto ">
      <h2 className="flex items-center gap-1.5 text-xl font-semibold mb-10 mt-3">
        <HiMiniPresentationChartBar className="w-7 h-7 text-slate-700" />
        Statystykki odnotowanych tematów
      </h2>
      <div>
        {usersWithStats?.map((user, index) => {
          return (
            <Card className="w-[45%]">
              <CardHeader className=" py-1">
                <CardTitle className="text-sm flex justify-between  ">
                  <div className="flex items-center gap-x-1">
                    <span className=" px-1 flex items-center justify-center border border-transparent rounded-lg hover:border hover:broder hover:border-gray-300/90">
                      {index + 1}
                      <TbArrowBadgeRightFilled className={"text-gray-600/60"} />
                    </span>
                    <span>{user.name}</span>
                    <span>{user.surname}</span>
                  </div>

                  {user.reportCount}
                </CardTitle>

                {/* <CardDescription className='text-xs flex items-center gap-1'>
                            
    
        
                </CardDescription>  */}
              </CardHeader>
            </Card>
          );
        })}
        <DatePicker setState={setStartDate} state={startDate} />
        <DatePicker setState={setEndDate} state={endDate} />
      </div>
    </div>
  );
};

export default StatisticsPage;
