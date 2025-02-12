import { conversationReportApi } from "@/lib/conversationReportsApi";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { HiMiniPresentationChartBar } from "react-icons/hi2";
import { DatePicker } from "@/components/DatePicker";
import { articlesApi } from "@/lib/articlesApi";
import UserReportStatisticsTable from "@/components/UserReportStatisticsTable";
import UserArticlesStatisticsTable from "@/components/UserArticlesStatisticsTable";
import UserEditedArticlesStatisticsTable from "@/components/UserEditedArticlesStatisticsTable";
import { IoMdSearch } from "react-icons/io";

import AButton from "@/components/core/Button";
const StatisticsPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date |null>();
  const [endDate, setEndDate] = useState<Date>();
  const [queryDates, setQueryDates] = useState({
    startDate: null,
    endDate: null,
  });

  const handleSearch = () => {
    // Sprawdzenie, czy daty są dostępne
    if (startDate && endDate) {
      // Tworzymy kopię daty, ustawiamy godzinę na 00:00, aby uniknąć problemów ze strefą czasową
      const start = new Date(startDate.setHours(0, 0, 0, 0)); // Ustawiamy czas na początek dnia
      const end = new Date(endDate.setHours(23, 59, 59, 999)); // Ustawiamy koniec dnia

      // Teraz konwertujemy je na ISO
      const startISO = start.toISOString();
      const endISO = end.toISOString();

      console.log("Start Date (ISO):", startISO);
      console.log("End Date (ISO):", endISO);

      setQueryDates({
        startDate: startISO,
        endDate: endISO,
      });
    }
  };



  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setQueryDates({ startDate: null, endDate: null });
  };

  const queryParams = { startDate, endDate };
console.log("paramatry")
console.log(typeof(queryParams.endDate))
  const { data: usersWithStats=[],isLoading:isReportStatsLoading } = useQuery({
    queryKey: ["reportStatistics", queryDates],
    queryFn: () => {
      return conversationReportApi.getCoversationReportStats(queryParams);
    },
  });

  const { data: usersWithArticleStats=[], isLoading:isCreatedArticleStatsLoading } = useQuery({
    queryKey: ["articleStats", queryDates],
    queryFn: () => {
      return articlesApi.getUsersArticleStats(queryParams);
    },
  });


  const { data: usersWithChangedArticleStats=[],isLoading:isChangedArticleStatsLoading } = useQuery({
    queryKey: ["changedArticleStats", queryDates],
    queryFn: () => {
      return articlesApi.getUsersChangedArticleStats(queryParams);
    },
  });


const isLoading = isReportStatsLoading || isCreatedArticleStatsLoading || isChangedArticleStatsLoading



return (
  <div className="py-6 px-9">
    <h2 className="flex items-center gap-2 text-2xl font-bold mb-8">
      <HiMiniPresentationChartBar className="w-8 h-8 text-blue-600" />
      Statystyki użytkowników
    </h2>

    {/* Sekcja filtrów */}
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtruj według zakresu dat</h3>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <DatePicker setState={setStartDate} state={startDate} label="Data początkowa" />
        <DatePicker setState={setEndDate} state={endDate} label="Data końcowa" />
        <AButton 
        
        icon={<IoMdSearch className="w-3.5 h-3.5"/>}
        label="Wyszukaj" 
        onClick={handleSearch} 
        className=" bg-blue-500 text-white rounded hover:bg-blue-600" 
        disabled={isLoading || !startDate || !endDate} 
        isLoading={isLoading}>
        
        </AButton>
        <AButton
        label="   Wyczyść filtry"
          disabled={!startDate && !endDate}
          onClick={handleClearFilters}
          className=" bg-slate-500 text-white rounded hover:bg-gray-600  "
        >
       
        </AButton>
      </div>
    </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
<UserReportStatisticsTable data={usersWithStats} isDataLoading={isReportStatsLoading} queryParams={queryParams}/>

 <UserArticlesStatisticsTable data={usersWithArticleStats} isDataLoading={isCreatedArticleStatsLoading} queryParams={queryParams}/>

<UserEditedArticlesStatisticsTable data={usersWithChangedArticleStats} isDataLoading={isChangedArticleStatsLoading} queryParams={queryParams}/>

    </div>
  </div>
);
};

export default StatisticsPage;
