import React, { useState } from "react";
import { FaFileAlt, FaHeadphones, FaUserCircle } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import { MdArticle } from "react-icons/md";
import { FaSquarePhone } from "react-icons/fa6";

import { MdEditDocument } from "react-icons/md";
const Dashboard: React.FC = () => {
  // Zakładki czasowe
  const tabs = ["today", "week", "month"];
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "today":
        return "Dzisiaj";
      case "week":
        return "W tym tygodniu";
      case "month":
        return "W tym miesiącu";
      default:
        return "";
    }
  };

  // Stany zakładek dla sekcji górnych
  const [leftTab, setLeftTab] = useState("today");
  const [rightTab, setRightTab] = useState("today");

  // Dane dla sekcji lewych kafelków
  const leftStats = {
    today: {
      articles: 128,
      conversations: 245,
      popularTopic: 32,
    },
    week: {
      articles: 890,
      conversations: 1200,
      popularTopic: 200,
    },
    month: {
      articles: 3200,
      conversations: 5000,
      popularTopic: 500,
    },
  };

  // Dane dla sekcji prawych kafelków
  const rightStats = {
    today: { avgTime: "5m 32s", resolutionRate: "92%" },
    week: { avgTime: "5m 15s", resolutionRate: "95%" },
    month: { avgTime: "5m 05s", resolutionRate: "96%" },
  };

  // Dane dla sekcji dolnych
  const recentArticles = [
    { id: 1, title: "Jak rozwiązać problem X?", date: "2025-01-10" },
    { id: 2, title: "Instrukcja konfiguracji Y", date: "2025-01-09" },
    { id: 3, title: "Najczęściej zadawane pytania", date: "2025-01-08" },
    { id: 4, title: "Poradnik: Zasady bezpieczeństwa", date: "2025-01-07" },
  ];

  const frequentTopics = [
    { id: 1, topic: "Resetowanie hasła", count: 32 },
    { id: 2, topic: "Problemy z logowaniem", count: 24 },
    { id: 3, topic: "Instrukcja obsługi systemu", count: 18 },
    { id: 4, topic: "Błędy aplikacji mobilnej", count: 14 },
    { id: 5, topic: "Aktualizacje systemu", count: 10 },
    { id: 5, topic: "Aktualizacje systemu", count: 10 },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-8 bg-gray-50">
      {/* Główna sekcja górna */}
      <div className="col-span-2 flex flex-col gap-6 ">
        {/* Po lewej: Zakładki + 3 kafelki */}
        <div className="flex flex-col gap-3 space-y-1 ">
          {/* Zakładki dla lewej sekcji */}
          <div className="flex gap-4 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab)}
                className={`py-2 px-3.5 rounded-lg font-semibold transition-all text-sm ${
                  leftTab === tab
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {getTabLabel(tab)}
              </button>
            ))}
          </div>
          {/* 3 kafelki */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-1">
            {/* Kafelek Liczba odnotowanych rozmów */}
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col items-center text-center border-l-4 border-blue-500">
              <FaHeadphones className="text-blue-500 text-5xl mb-4" />
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Liczba odnotowanych rozmów
              </h2>
              <p className="mt-3 text-4xl font-semibold text-gray-900">
                {leftStats[leftTab].conversations}
              </p>
            </div>

            {/* Kafelek Liczba artykułów */}
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col items-center text-center border-l-4 border-green-500">
              <MdArticle className="text-green-500 text-5xl mb-4" />
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Liczba dodanych artykułów
              </h2>
              <p className="mt-3 text-4xl font-semibold text-gray-900">
                {leftStats[leftTab].articles}
              </p>
            </div>

            {/* Kafelek Najpopularniejszy temat */}
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col items-center text-center border-l-4 border-yellow-500">
              <MdEditDocument className="text-yellow-500 text-5xl mb-4" />
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Liczba edytowanych artykułów
              </h2>
              <p className="mt-3 text-4xl font-semibold text-gray-900">
                {leftStats[leftTab].popularTopic}
              </p>
            </div>
          </div>

          {/* Najczęściej odnotowywane tematy rozmów */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Najczęściej odnotowywane tematy rozmów
            </h3>
            <ul className="space-y-4">
              {frequentTopics.map((topic) => (
                <li
                  key={topic.id}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300 ease-in-out"
                >
                  <div className="flex items-center gap-3">
                    <IoMdCall className="text-green-600" />
                    <p className="font-medium text-gray-800">{topic.topic}</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {topic.count} razy
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Po prawej: Zakładki + 2 kafelki */}
      <div className="flex flex-col  py-2 px-2 p-6">
        {/* Zakładki dla prawej sekcji */}
        <div className="flex gap-4 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setRightTab(tab)}
              className={`py-2 px-3.5 rounded-lg font-semibold transition-all text-sm ${
                rightTab === tab
                  ? "bg-teal-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>

        {/* 2 kafelki */}
        <div className="grid grid-cols-1 gap-2 flex-grow  bg-white">
          <span className="py-1.5 px-2.5 font-semibold bg-slate-200 rounded-lg">
            Moje statystyki
          </span>
          <div className="p-6 bg-indigo-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="flex items-center gap-2">
              <FaSquarePhone className="text-gray-800 text-2xl" />
              <h2 className="text-sm font-semibold text-gray-500 uppercase">
                Liczba odnotowanych rozmów
              </h2>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-800">
              {rightStats[rightTab].conversationsByUser}
            </p>
          </div>
          <div className="p-6 bg-indigo-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="flex items-center gap-2">
              <MdArticle className="text-gray-800 text-2xl" />
              <h2 className="text-sm font-semibold text-gray-500 uppercase">
                Liczba dodanych artykułów
              </h2>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-800">
              {rightStats[rightTab].conversationsByUser}
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="flex items-center gap-2">
              <MdEditDocument className="text-gray-800 text-2xl" />
              <h2 className="text-sm font-semibold text-gray-500 uppercase">
                Liczba edytowanych artykułów
              </h2>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-800">
              {rightStats[rightTab].articlesByUser}
            </p>
          </div>
          {/* Ostatnio dodane artykuły */}
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Ostatnio dodane artykuły
            </h3>
            <ul className="space-y-4">
              {recentArticles.map((article) => (
                <li
                  key={article.id}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300 ease-in-out"
                >
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="text-blue-600" />
                    <p className="font-medium text-gray-800">{article.title}</p>
                  </div>
                  <span className="text-sm text-gray-600">{article.date}</span>
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
