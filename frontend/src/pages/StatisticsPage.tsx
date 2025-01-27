import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { conversationReportApi } from "@/lib/conversationReportsApi";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { RiFileEditFill } from "react-icons/ri";
import { IoMdCall } from "react-icons/io";
import { HiMiniPresentationChartBar } from "react-icons/hi2";
import { DatePicker } from "@/components/DatePicker";
import { articlesApi } from "@/lib/articlesApi";
import { MdArticle } from "react-icons/md";
import { useModalContext } from "@/contexts/ModalContext";
import UserReportDetails from "@/components/UserReportDetails";
import UserArticlesDetails from "@/components/UserArticlesDetails";
import UserArticleChangesDetails from "@/components/UserArticleChangesDetails";
const StatisticsPage: React.FC = () => {
  const {openContentModal} =useModalContext();
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


  const openInModalHandler = (userId) => {
    openContentModal({
      description: "",
      content: (<UserReportDetails userId={userId} queryParams={queryParams}/>),
      enableOutsideClickClose: true,
      size: "lg",
    });
  };
  

const openUserArticlesDetails = (userId) =>{
  openContentModal({
    description: "",
    content: (<UserArticlesDetails userId={userId} queryParams={queryParams}/>),
    enableOutsideClickClose: true,
    size: "lg",
    
  });
}

const openUserChangedArticlesDetails = (userId) =>{
  openContentModal({
    description: "",
    content: (<UserArticleChangesDetails userId={userId} queryParams={queryParams}/>),
    enableOutsideClickClose: true,
    size: "lg",
   
    scrollable: false,
  });
}


  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setQueryDates({ startDate: null, endDate: null });
  };

  const queryParams = { startDate, endDate };
console.log("paramatry")
console.log(typeof(queryParams.endDate))
  const { data: usersWithStats,isLoading:isReportStatsLoading } = useQuery({
    queryKey: ["reportStatistics", queryDates],
    queryFn: () => {
      return conversationReportApi.getCoversationReportStats(queryParams);
    },
  });

  const { data: usersWithArticleStats, isLoading:isCreatedArticleStatsLoading } = useQuery({
    queryKey: ["articleStats", queryDates],
    queryFn: () => {
      return articlesApi.getUsersArticleStats(queryParams);
    },
  });


  const { data: usersWithChangedArticleStats,isLoading:isChangedArticleStatsLoading } = useQuery({
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Filtruj według zakresu dat
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <DatePicker
            setState={setStartDate}
            state={startDate}
            label="Data początkowa"
          />
          <DatePicker
            setState={setEndDate}
            state={endDate}
            label="Data końcowa"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Wyszukaj
          </button>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Wyczyść filtry
          </button>
        </div>
      </div>

{!isLoading ? (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
    {[...Array(3)].map((_, idx) => (
      <Card key={idx} className="shadow-md border border-gray-200">
        <CardHeader className="bg-gray-100 border-b border-gray-300 py-4 flex gap-3">
          <div className="w-full h-10" />
        </CardHeader>
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-8 w-full border border-gray-200 rounded-md"
            />
          ))}
        </div>
      </Card>
    ))}
  </div>
):
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista tematów rozmów */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader 
          className="bg-gray-100 border-b border-gray-300 py-4 flex  gap-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex justify-center items-center bg-teal-500 rounded-md">
                <IoMdCall className="w-6 h-6 text-green-200" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Odnotowane tematy rozmów
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Lista użytkowników z liczbą odnotowanych tematów
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="p-4 space-y-3">
            {usersWithStats?.map((user, index) => (
              <div
              onClick={()=>openInModalHandler(user?._id)}
                key={user._id}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {index + 1}.
                  </span>
                  <span className="text-gray-900 font-medium">
                    {user.name} {user.surname}
                  </span>
                </div>
                <span className="text-gray-600 font-semibold">
                  {user.reportCount}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Lista dodanych artykułów */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="bg-gray-100 border-b border-gray-300 py-4  flex gap-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex justify-center items-center  rounded-md bg-amber-500/70">
                <MdArticle className="w-6 h-6  text-yellow-50" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Dodane artykuły
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Lista użytkowników z liczbą dodanych artykułów
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="p-4 space-y-3">
            {usersWithArticleStats?.map((user, index) => (
              <div
              onClick={()=>openUserArticlesDetails(user._id)}
                key={user._id}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {index + 1}.
                  </span>
                  <span className="text-gray-900 font-medium">
                    {user.name} {user.surname}
                  </span>
                </div>
                <span className="text-gray-600 font-semibold">
                  {user.createdArticleCount}
                </span>
              </div>
            ))}
          </div>
        </Card>


                {/* Lista edytowanych artykułów */}
                <Card className="shadow-md border border-gray-200">
          <CardHeader className="bg-gray-100 border-b border-gray-300 py-4  flex gap-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex justify-center items-center  rounded-md bg-blue-600/70">
                <RiFileEditFill className="w-6 h-6  text-blue-50" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Edytowane artykuły
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Lista użytkowników z liczbą edytowanych artykułów
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <div className="p-4 space-y-3">
            {usersWithChangedArticleStats?.map((user, index) => (
              <div
              onClick={()=>openUserChangedArticlesDetails(user?._id)}
                key={user?._id}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-md hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {index + 1}.
                  </span>
                  <span className="text-gray-900 font-medium">
                    {user?.name} {user?.surname}
                  </span>
                </div>
                <span className="text-gray-600 font-semibold">
                  {user?.updatedArticleCount}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>}
    </div>
  );
};

export default StatisticsPage;
