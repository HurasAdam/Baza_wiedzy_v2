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
    return articlesApi.getLatestArticles({limit:4})
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
    return conversationReportApi.getConversationReportValues({range:selectedPeriodd, limit:5})
  }
})
const {data:mostPopularArticles, isLoading: isLoadingMostPopularArticles} = useQuery({
  queryKey:["popular_articles"],
  queryFn:()=>{
    return articlesApi.getPopularArticles({limit:5})
  }
})




const isLoading = isLoadingLatestArticles || isLoadingUserStats || isLoadingDashboardStats || isLoadingMostPopularTopics;


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
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
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
          <div className="text-lg font-bold text-gray-900 min-h-7">{userStats?.userConversations}</div>
        )}
      </div>
    </div>

    {/* Dodane artykuły */}
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
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
          <div className="text-lg font-bold text-gray-900 min-h-7">{userStats?.userArticles}</div>
        )}
      </div>
    </div>

    {/* Edytowane artykuły */}
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
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
          <div className="text-lg font-bold text-gray-900 min-h-7">{userStats?.userEditedArticles}</div>
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
    
    {
    
    isLoading ? [1,2,3,4,5].map((item,index)=>{
      return(
        <li
        key={index}
        className="flex justify-cetner items-center py-4 px-5 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all ease-in-out duration-300 overflow-hidden"
      >
        {/* Topic Title */}
        <span className="text-gray-700 text-sm font-semibold flex-grow max-w-[600px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
          
        </span>

        {/* Badge for the product with fixed width */}
        <span
          className="hidden xl:block px-1 py-1 text-xs font-semibold rounded-full text-white w-[100px] text-center overflow-hidden text-ellipsis whitespace-nowrap"

        >
         <LoadingSpinner/>
        </span>

        {/* Report Count */}
        <span className="text-xs text-gray-500 ml-4"></span>
      </li>
      )
    }):
    mostPopularTopics?.map((topic, index) => (
      <li
        key={index}
        className="flex justify-between items-center py-4 px-5 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all ease-in-out duration-300 overflow-hidden"
      >
        {/* Topic Title */}
        <span className="text-gray-700 text-sm font-semibold flex-grow max-w-[600px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
          {topic?.topicTitle}
        </span>

        {/* Badge for the product with fixed width */}
        <span
          className="hidden xl:block px-1 py-1 text-xs font-semibold rounded-full text-white w-[100px] text-center overflow-hidden text-ellipsis whitespace-nowrap"
          style={{
            backgroundColor: topic?.product?.labelColor,
          }}
        >
          {topic?.product?.name}
        </span>

        {/* Report Count */}
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
              {latestArticles && latestArticles?.map((article, index) => (
                <li
                onClick={()=>openInModalHandler(article?._id)}
                  key={index}
                  className="flex bg-white items-center space-x-3 rounded-lg shadow-sm p-3 hover:shadow-md transition-all cursor-pointer hover:bg-slate-50/80"
                >
                  <div className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full h-8 w-8">
                    <FaBook className="text-base" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-700">{article?.title}</h4>
                 <div className='text-xs max-w-[110px] truncate overflow-hidden text-ellipsis whitespace-nowrap '           style={{
            color: article?.product?.labelColor,
          }}> {article?.product?.name}</div>
                  </div>
                 <span className='text-xs font-semibold text-gray-500  '> {formatDate(article?.createdAt)}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Najpopularniejsze artykuły */}
          <div className="bg-white shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3"><FaSearch className="inline-block mr-2" />Najpopularniejsze artykuły</h3>
            <ul className="space-y-3">
              {mostPopularArticles?.map((article, index) => (
                <li
                onClick={()=>openInModalHandler(article?._id)}
                  key={index}
                  className="flex bg-white items-center space-x-3 rounded-lg shadow-sm p-3 hover:shadow-md hover:bg-slate-50/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-center bg-green-100 text-green-600 rounded-full h-8 w-8">
                    <FaChartLine className="text-base" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-700">{article?.title}</h4>
                    <span className="text-xs text-gray-500">{article?.product?.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Ostatnio dodane artykuły */}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
