import React, { useState } from 'react';
import { FaStar, FaTrash, FaReply } from 'react-icons/fa';

const articless = [
  { id: 1, title: 'Build stunning courses with Content...', preview: 'Nullam molestie tincidunt sem, at tincidunt libero...', content: 'Full article content for course building...', author: 'Ben Cline', date: 'Dec 15' },
  { id: 2, title: 'Special Request for Attendance to Quarterly Meeting', preview: 'Phasellus ante felis, eleifend vitae malesuada...', content: 'Full article content for meeting request...', author: 'Erric Hoffman', date: 'Dec 15' },
  { id: 3, title: "Let's finish your listing!", preview: 'Mauris lorem quam, pretium ac tellus in, bibendum...', content: 'Full article content for listing...', author: 'Airbnb', date: 'Dec 15' },
  { id: 4, title: 'About Latest TPA Report', preview: 'Curabitur massa ipsum, scelerisque vel mattis...', content: 'Full article content for TPA report...', author: 'Mateusz Nieckarz', date: 'Dec 15' },
];





const ArticleList = ({ onSelect,articles }) => {
  console.log("articles")
  console.log(articles)
  return (
    <div className="w-1/3 bg-gray-100 border-r border-gray-300 h-screen overflow-y-auto p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Inbox</h2>
      {articles?.data?.map((article) => (
        <div
          key={article.id}
          className="p-3 mb-2 bg-white rounded-lg shadow-md cursor-pointer hover:bg-blue-50 transition"
          onClick={() => onSelect(article)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-800">{article.title}</h3>
            <span className="text-xs text-gray-500">{article.date}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">{article.preview}</p>
        </div>
      ))}
    </div>
  );
};

const ArticleDetails = ({ article }) => {
  if (!article) {
    return (
      <div className="w-2/3 p-6 flex items-center justify-center text-gray-500">
        Wybierz artykuł, aby zobaczyć szczegóły.
      </div>
    );
  }

  return (
    <div className="w-2/3 p-6 bg-white h-screen overflow-y-auto">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{article.title}</h2>
          <p className="text-sm text-gray-600">{article.author} • {article.date}</p>
        </div>
        <div className="flex space-x-4 text-gray-500">
          <FaStar className="cursor-pointer hover:text-yellow-500" />
          <FaReply className="cursor-pointer hover:text-blue-500" />
          <FaTrash className="cursor-pointer hover:text-red-500" />
        </div>
      </div>
      <p className="text-gray-700 text-lg">{article.content}</p>
    </div>
  );
};

const ArticlesGridView = ({articles}) => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <ArticleList 
      articles={articles}
      onSelect={setSelectedArticle} />
      <ArticleDetails article={selectedArticle} />
    </div>
  );
};

export default ArticlesGridView;
