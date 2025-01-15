import { articlesApi } from '@/lib/articlesApi';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaChartLine, FaRegEdit, FaBook, FaUser, FaRocket, FaSearch, FaChartBar } from 'react-icons/fa';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");


const {data:latestArticles} = useQuery({
  queryKey:["latest_articles"],
  queryFn:()=>{
    return articlesApi.getLatestArticles({limit:4})
  }
})
 

  const statsData = {
    today: [
      { title: "Odnotowane rozmowy", value: "100", percentage: "+5%", icon: <FaChartLine className="text-blue-500 text-2xl" /> },
      { title: "Dodane artykuły", value: "25", percentage: "+2%", icon: <FaBook className="text-green-500 text-2xl" /> },
      { title: "Edytowane artykuły", value: "12", percentage: "+1%", icon: <FaRegEdit className="text-yellow-500 text-2xl" /> },
    ],
    week: [
      { title: "Odnotowane rozmowy", value: "1 245", percentage: "+12%", icon: <FaChartLine className="text-blue-500 text-2xl" /> },
      { title: "Dodane artykuły", value: "345", percentage: "+8%", icon: <FaBook className="text-green-500 text-2xl" /> },
      { title: "Edytowane artykuły", value: "98", percentage: "+5%", icon: <FaRegEdit className="text-yellow-500 text-2xl" /> },
    ],
    month: [
      { title: "Odnotowane rozmowy", value: "5 000", percentage: "+20%", icon: <FaChartLine className="text-blue-500 text-2xl" /> },
      { title: "Dodane artykuły", value: "1 250", percentage: "+10%", icon: <FaBook className="text-green-500 text-2xl" /> },
      { title: "Edytowane artykuły", value: "500", percentage: "+15%", icon: <FaRegEdit className="text-yellow-500 text-2xl" /> },
    ],
  };

  const userStats = {
    today: { "Odnotowane rozmowy": "50", "Dodane artykuły": "10", "Edytowane artykuły": "5" },
    week: { "Odnotowane rozmowy": "200", "Dodane artykuły": "35", "Edytowane artykuły": "10" },
    month: { "Odnotowane rozmowy": "1 000", "Dodane artykuły": "100", "Edytowane artykuły": "30" },
  };

  // const latestArticles = [
  //   { topic: "Jak dodać ucznia", frequency: "30 razy" },
  //   { topic: "Dlaczego nie widzę powiadomień", frequency: "25 razy" },
  //   { topic: "Jak odnotować dzień wolny szkoły", frequency: "20 razy" },
  // ];

  const frequentVisitedArticles = [
    { topic: "Jak dodać ucznia", frequency: "30 razy" },
    { topic: "Dlaczego nie widzę powiadomień", frequency: "25 razy" },
    { topic: "Jak odnotować dzień wolny szkoły", frequency: "20 razy" },
    { topic: "Jak dodać zastępstwo", frequency: "18 razy" },
    { topic: "Promocja ucznia - wszystkie kroki", frequency: "15 razy" },
  ];

  const frequentTopics = {
    today: [
      { topic: "Sztuczna inteligencja", frequency: "30 razy" },
      { topic: "Blockchain", frequency: "25 razy" },
      { topic: "Edukacja online", frequency: "20 razy" },
    ],
    week: [
      { topic: "Sztuczna inteligencja", frequency: "150 razy" },
      { topic: "Blockchain", frequency: "130 razy" },
      { topic: "Edukacja online", frequency: "120 razy" },
    ],
    month: [
      { topic: "Sztuczna inteligencja", frequency: "600 razy" },
      { topic: "Blockchain", frequency: "500 razy" },
      { topic: "Edukacja online", frequency: "450 razy" },
    ],
  };

  const handleTabClick = (period) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="p-4 bg-gray-50 h-full space-y-6">
      {/* Górna część: podzielona na prawą i lewą */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-4 mt-0.5">
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
                {["today", "week", "month"].map((period) => (
                  <button
                    key={period}
                    onClick={() => handleTabClick(period)}
                    className={`py-1 px-3.5 text-sm font-semibold ${
                      selectedPeriod === period ? "bg-blue-500 text-white" : "text-blue-500"
                    } rounded-md`}
                  >
                    {period === "today" ? "Dziś" : period === "week" ? "Tydzień" : "Miesiąc"}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statsData[selectedPeriod].map((stat, index) => (
                <div
                  key={index}
                  className={`rounded-lg shadow-sm p-6 flex items-center space-x-4 ${stat.title === "Odnotowane rozmowy" ? "bg-blue-50" : stat.title === "Dodane artykuły" ? "bg-green-50" : "bg-orange-50"}`}

                >
                  <div className="flex-shrink-0 text-3xl">
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moje statystyki */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              <FaUser className="inline-block mr-2 text-blue-500" />
              Moje statystyki
            </h3>
            <div className="space-y-4">
              {Object.entries(userStats[selectedPeriod]).map(([key, value], index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    {key === "Odnotowane rozmowy" && <FaUser className="text-blue-600 text-xl" />}
                    {key === "Dodane artykuły" && <FaBook className="text-green-600 text-xl" />}
                    {key === "Edytowane artykuły" && <FaRegEdit className="text-yellow-600 text-xl" />}
                    <span className="text-gray-700 font-semibold">{key}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                    <span className="text-xs text-gray-500">
                      {statsData[selectedPeriod].find(stat => stat.title === key)?.percentage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Najczęściej odnotowywane tematy */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              <FaChartLine className="inline-block mr-2 text-blue-500" />
              Najczęściej odnotowywane tematy
            </h3>
            <ul className="space-y-3">
              {frequentTopics[selectedPeriod].map((topic, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-4 px-5 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all ease-in-out duration-300"
                >
                  <span className="text-gray-700 text-sm font-semibold">{topic.topic}</span>
                  <span className="text-xs text-gray-500">{topic.frequency}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prawa część */}
        <div className="space-y-4">
          {/* Najpopularniejsze artykuły */}
          <div className="bg-white shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3"><FaSearch className="inline-block mr-2" />Najpopularniejsze artykuły</h3>
            <ul className="space-y-3">
              {frequentVisitedArticles.map((topic, index) => (
                <li
                  key={index}
                  className="flex bg-white items-center space-x-3 rounded-lg shadow-sm p-3 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-center bg-green-100 text-green-600 rounded-full h-8 w-8">
                    <FaChartLine className="text-base" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-700">{topic.topic}</h4>
                    <span className="text-xs text-gray-500">{topic.frequency}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Ostatnio dodane artykuły */}
          <div className="bg-white shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3"><FaRocket className="inline-block mr-2" />Ostatnio dodane artykuły</h3>
            <ul className="space-y-3">
              {latestArticles?.map((article, index) => (
                <li
                  key={index}
                  className="flex bg-white items-center space-x-3 rounded-lg shadow-sm p-3 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full h-8 w-8">
                    <FaBook className="text-base" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-700">{article?.title}</h4>
                  
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
