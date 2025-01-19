import LoadingSpinner from '@/components/LoadingSpinner';
import { useModalContext } from '@/contexts/ModalContext';
import { api } from '@/lib/api';
import { articlesApi } from '@/lib/articlesApi';
import { conversationReportApi } from '@/lib/conversationReportsApi';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';
import { FaChartLine, FaRegEdit, FaBook, FaUser, FaRocket, FaSearch, FaChartBar } from 'react-icons/fa';
import ArticleDetailsInModal from './ArticleDetailsInModal';
import { formatDate } from '@/lib/utils';

const Dashboard = () => {
   enum Period {
    Today = "today",
    Last7Days = "last7days",
    Last30Days = "last30days",
  }

  interface IHandleTabClick {
    (period: Period): void;
  }

  const {openContentModal} = useModalContext();
  const [selectedPeriodd, setSelectedPeriodd] = useState<Period>(Period.Today);

const {data:latestArticles,isLoading:isLoadingLatestArticles} = useQuery({
  queryKey:["latest_articles"],
  queryFn:()=>{
    return articlesApi.getLatestArticles({limit:5})
  }
})
 

const {data:userStats,isLoading: isLoadingUserStats} = useQuery({
  queryKey:["user_stats",selectedPeriodd],
  queryFn:()=>{
    return api.getUserDashboardStats({range:selectedPeriodd})
  }
})


const {data:dashboardStats, isLoading: isLoadingDashboardStats,isFetching} = useQuery({
  queryKey:["dashboard_stats",selectedPeriodd],
  queryFn:()=>{
    return api.getDashboardStats({range:selectedPeriodd})
  }
})


const {data:mostPopularTopics, isLoading: isLoadingMostPopularTopics} = useQuery({
  queryKey:["popular_topics",selectedPeriodd],
  queryFn:()=>{
    return conversationReportApi.getConversationReportValues({range:selectedPeriodd, limit:6})
  }
})
const {data:mostPopularArticles, isLoading: isLoadingMostPopularArticles} = useQuery({
  queryKey:["popular_articles"],
  queryFn:()=>{
    return articlesApi.getPopularArticles({limit:6})
  }
})




const isLoading = isLoadingLatestArticles || isLoadingUserStats || isLoadingDashboardStats || isLoadingMostPopularTopics || isLoadingMostPopularArticles


const openInModalHandler = (aritcleId) => {
  openContentModal({
    description: "",
    content: <ArticleDetailsInModal type="modal" articleId={aritcleId} />,
    enableOutsideClickClose: true,
    size: "xl",
  });
};



  const frequentVisitedArticles = [
    { topic: "Jak dodać ucznia", frequency: "30 razy" },
    { topic: "Dlaczego nie widzę powiadomień", frequency: "25 razy" },
    { topic: "Jak odnotować dzień wolny szkoły", frequency: "20 razy" },
    { topic: "Jak dodać zastępstwo", frequency: "18 razy" },
    { topic: "Promocja ucznia - wszystkie kroki", frequency: "15 razy" },
  ];

  


  const handleTabClick:IHandleTabClick = (period) => {
    setSelectedPeriodd(period);
  };

  return (
    <div className="p-4 bg-gray-50 h-full space-y-6">
      {/* Górna część: podzielona na prawą i lewą */}
      <div className="grid grid-cols-1 2xl:grid-cols-[5fr_4fr] gap-4 mt-0.5">
        {/* Lewa część */}
        <div className="space-y-4 ">
          {/* Sekcja statystyk działu */}
          <div className="bg-white rounded-lg shadow-sm p-6  space-y-4">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                <FaChartBar className="mr-2 text-blue-600" /> Statystyki działu
              </h3>
              {/* Przycisk wyboru okresu */}
              <div className="flex space-x-4">
                {Object.values(Period).map((period) => (
                  <button
                    key={period}
                    onClick={() => handleTabClick(period)}
                    className={`py-1 px-3.5 text-sm font-semibold ${
                      selectedPeriodd === period ? "bg-blue-500 text-white" : "text-blue-500"
                    } rounded-md`}
                  >
                    {period === "today" ? "Dziś" : period === "last7days" ? "Tydzień" : "Miesiąc"}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             
            <div
  className={`rounded-lg shadow-sm p-6 flex items-center space-x-4 bg-blue-50 min-h-[120px]`}
>
  <div className="flex-shrink-0 text-3xl">
    <FaChartLine className="text-blue-500 text-2xl" />
  </div>
  <div className="h-full flex flex-col justify-between">
    <h3 className="text-sm font-semibold text-gray-700">Odnotowane rozmowy</h3>
    {isLoading ? (
      <div className="h-full flex items-start justify-start">
        <LoadingSpinner color='red' />
      </div>
    ) : (
      <div className="h-full text-2xl font-bold text-gray-900 mt-1">
        {dashboardStats?.recordedConversations}
      </div>
    )}
  </div>
</div>
                

<div
  className={`rounded-lg shadow-sm p-6 flex items-center space-x-4 bg-green-50 min-h-[120px]`}
>
  <div className="flex-shrink-0 text-3xl">
    <FaBook className="text-green-500 text-2xl" />
  </div>
  <div className="h-full flex flex-col justify-between">
    <h3 className="text-sm font-semibold text-gray-700">Dodane artykuły</h3>
    {isLoading ? (
      <div className="h-full flex items-center justify-center ">
        <LoadingSpinner />
      </div>
    ) : (
      <div className="h-full text-2xl font-bold text-gray-900 mt-1">
        {dashboardStats?.addedArticles}
      </div>
    )}
  </div>
</div>

<div
  className={`rounded-lg shadow-sm p-6 flex items-center space-x-4 bg-orange-50 min-h-[120px]`}
>
  <div className="flex-shrink-0 text-3xl">
    <FaRegEdit className="text-yellow-500 text-2xl" />
  </div>
  <div className="h-full flex flex-col justify-between">
    <h3 className="text-sm font-semibold text-gray-700">Edytowane artykuły</h3>
    {isLoading ? (
      <div className="h-full flex items-center justify-center min-h-8">
        <LoadingSpinner />
      </div>
    ) : (
      <div className="h-full text-2xl font-bold text-gray-900 mt-1 min-h-8">
        {dashboardStats?.editedArticles}
      </div>
    )}
  </div>
</div>
         
            </div>
          </div>

          {/* Moje statystyki */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
  <h3 className="text-sm font-semibold text-gray-700 mb-4">
    <FaUser className="inline-block mr-2 text-blue-500" />
    Moje statystyki
  </h3>
  <div className="space-y-4">
    {/* Odnotowane rozmowy */}
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm ">
      <div className="flex items-center space-x-4">
        <FaChartLine className="text-blue-600 text-xl" />
        <span className="text-gray-700 font-semibold">Odnotowane rozmowy</span>
      </div>
      <div className="flex items-center space-x-2">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-7">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="text-lg font-semibold text-gray-600  min-h-7 px-3">{userStats?.userConversations}</div>
        )}
      </div>
    </div>

    {/* Dodane artykuły */}
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm ">
      <div className="flex items-center space-x-4">
        <FaBook className="text-green-600 text-xl" />
        <span className="text-gray-700 font-semibold">Dodane artykuły</span>
      </div>
      <div className="flex items-center space-x-2 min-h-8">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="text-lg font-semibold text-gray-600  min-h-7 px-3">{userStats?.userArticles}</div>
        )}
      </div>
    </div>

    {/* Edytowane artykuły */}
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm ">
      <div className="flex items-center space-x-4">
        <FaRegEdit className="text-yellow-600 text-xl" />
        <span className="text-gray-700 font-semibold">Edytowane artykuły</span>
      </div>
      <div className="flex items-center space-x-2">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-7">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="text-lg font-semibold text-gray-600 min-h-7 px-3">{userStats?.userEditedArticles}</div>
        )}
      </div>
    </div>
  </div>
</div>


          {/* Najczęściej odnotowywane tematy */}
          <div className="bg-white rounded-lg shadow-sm p-4">
  <h3 className="text-sm font-semibold text-gray-700 mb-3">
    <FaChartLine className="inline-block mr-2 text-blue-500" />
    Najczęściej odnotowywane tematy
  </h3>
  <ul className="space-y-3">
  {isLoading
    ? [1, 2, 3, 4, 5].map((_, index) => (
        <li
          key={index}
          className="flex justify-center items-center py-4 px-5 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all ease-in-out duration-300 overflow-hidden relative h-14"
        >
          {/* Pasek po lewej stronie - skeleton */}
          <div className="absolute left-0 top-0 h-full w-1 bg-gray-300 rounded-l-lg"></div>

          {/* Skeleton dla tytułu */}
          <span className="bg-gray-200 h-4 w-3/4 rounded  flex-grow max-w-[720px]"></span>

          {/* Skeleton dla odznaki produktu */}
       

          {/* Skeleton dla liczby raportów */}
          <span className="bg-gray-200 h-3 w-12 ml-4 rounded "></span>
        </li>
      ))
    : mostPopularTopics?.map((topic, index) => (
        <li
          key={index}
          className="flex justify-between items-center py-4 px-5 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all ease-in-out duration-300 overflow-hidden relative h-12"
        >
          {/* Pasek po lewej stronie */}
          <div
            style={{
              backgroundColor: topic?.product?.labelColor || "#ddd", // Domyślny kolor
            }}
            className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
          ></div>

          {/* Tytuł tematu */}
          <span className="text-gray-700 text-sm font-semibold flex-grow max-w-[720px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
            {topic?.topicTitle}
          </span>

          {/* Odznaka produktu */}


          {/* Liczba raportów */}
          <span className="text-xs text-gray-500 ml-4">{topic?.reportCount}</span>
        </li>
      ))}
</ul>


</div>
        </div>

        {/* Prawa część */}
        <div className="space-y-4">
        <div className="bg-white shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3"><FaRocket className="inline-block mr-2" />Ostatnio dodane artykuły</h3>
            <ul className="space-y-3">
  {isLoading ? (
    [1, 2, 3, 4].map((_, index) => (
      <li
        key={index}
        className="flex bg-white items-center space-x-3 rounded-lg shadow-sm p-3   relative min-h-14"
      >
        {/* Pasek po lewej stronie */}
        <div
          style={{
            backgroundColor: "#ddd", // Kolor zaślepki dla skeletonu
          }}
          className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
        ></div>

        <div className="flex items-center justify-center bg-gray-200 text-gray-200 rounded-full h-8 w-8 animate-spin">
          {/* Zaślepka dla ikony */}
        </div>

        <div className="flex-1">
          {/* Skeleton dla tytułu */}
          <div className="bg-gray-200 h-4 w-3/4 rounded "></div>
          {/* Skeleton dla podtytułu */}
          <div className="bg-gray-200 h-3 w-1/2 mt-2 rounded "></div>
        </div>
        {/* Skeleton dla daty */}
        <div className="bg-gray-200 h-3 w-16 rounded "></div>
      </li>
    ))
  ) : (
    latestArticles?.map((article, index) => (
      <li
        onClick={() => openInModalHandler(article?._id)}
        key={index}
        className="flex bg-white items-center space-x-3 rounded-lg shadow-sm p-3 hover:shadow-md transition-all cursor-pointer hover:bg-slate-50/80 relative min-h-14"
      >
        {/* Pasek po lewej stronie */}
        <div
          style={{
            backgroundColor: article?.product?.labelColor || "#ddd", // Domyślny kolor, jeśli brak labelColor
          }}
          className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
        ></div>

        <div className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full h-8 w-8">
          <FaBook className="text-base" />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-700">{article?.title}</h4>
          <div className="text-xs max-w-[110px] truncate overflow-hidden text-ellipsis whitespace-nowrap text-slate-500">
            {article?.product?.name}
          </div>
        </div>
        <span className="text-xs font-semibold text-gray-500">
          {formatDate(article?.createdAt)}
        </span>
      </li>
    ))
  )}
</ul>


          </div>
          {/* Najpopularniejsze artykuły */}
          <div className="bg-white shadow-sm p-6  ">
            <h3 className="text-sm font-semibold text-gray-700 mb-3"><FaSearch className="inline-block mr-2" />Najpopularniejsze artykuły</h3>
            <ul className="space-y-3">
  {isLoading ? (
    [1, 2, 3, 4, 5,6].map((_, index) => (
      <li
        key={index}
        className="flex bg-white items-center space-x-3 rounded-lg shadow-sm p-3  relative h-16"
      >
        {/* Pasek po lewej stronie */}
        <div
          style={{
            backgroundColor: "#ddd", // Kolor zaślepki dla skeletonu
          }}
          className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
        ></div>

        <div className="flex items-center justify-center bg-gray-200 text-gray-200 rounded-full h-8 w-8 ">
          {/* Zaślepka dla ikony */}
        </div>

        <div className="flex-1">
          {/* Skeleton dla tytułu */}
          <div className="bg-gray-200 h-4 w-3/4 rounded "></div>
          {/* Skeleton dla nazwy produktu */}
          <div className="bg-gray-200 h-3 w-1/2 mt-2 rounded "></div>
        </div>
      </li>
    ))
  ) : (
    mostPopularArticles?.map((article, index) => (
      <li
        onClick={() => openInModalHandler(article?._id)}
        key={index}
        className="flex bg-white items-center space-x-3 rounded-lg shadow-sm p-3 hover:shadow-md transition-all cursor-pointer relative h-16"
      >
        {/* Pasek po lewej stronie */}
        <div
          style={{
            backgroundColor: article?.product?.labelColor || "#ddd", // Domyślny kolor, jeśli brak labelColor
          }}
          className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
        ></div>

        <div className="flex items-center justify-center bg-green-100 text-green-600 rounded-full h-8 w-8">
          <FaChartLine className="text-base" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-700">{article?.title}</h4>
          <span className="text-xs text-gray-500">{article?.product?.name}</span>
        </div>
      </li>
    ))
  )}
</ul>



          </div>

          {/* Ostatnio dodane artykuły */}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
