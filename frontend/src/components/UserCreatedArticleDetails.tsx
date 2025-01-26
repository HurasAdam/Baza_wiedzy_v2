import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { articlesApi } from '@/lib/articlesApi';
import ArticleDetailsCardLite from './ArticleDetailsCardLite';
import { IMAGES } from '@/constants/images';
import Spinner from './core/Spinner';

const UserCreatedArticleDetails = ({ articleId }) => {
  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['selectedUserArticle', articleId],
    queryFn: () => articlesApi.getArticle({id:articleId}),
    enabled: !!articleId, // Zapytanie wysyłane tylko, gdy przekazano articleId
  });


  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
      {/* Subtelny spinner z komunikatem */}
      <div className="flex flex-col items-center space-y-2">
        <Spinner animation="spin" size="lg" color="bg-blue-500" />
        <p className="text-lg font-semibold text-gray-600">Pobieranie danych...</p>
      </div>
    </div>
    )
  }

  if (isError || !article) {
    return        <div className=" shadow bg-neutral-100 h-full rounded-lg p-6 text-center py-14  ">
                  <span className="text-xl font-semibold  text-slate-600 ">
                    {" "}
                    Wybierz artykuł, aby zobaczyć szczegóły.
                  </span>
                  <div className="flex justify-center items-center  rounded-lg p-6 mt-20 ">
                    <img
                      src={IMAGES.data_placeholder}
                      alt="Artykuł zweryfikowany"
                      className="w-full max-w-xs sm:max-w-sm md:max-w-md scale-125"
                    />
                  </div>
                </div>
  }

  return (
    <ArticleDetailsCardLite article={article}/>
  );
};

export default UserCreatedArticleDetails;
