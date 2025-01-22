import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { articlesApi } from '@/lib/articlesApi';
import ArticleDetailsCardLite from './ArticleDetailsCardLite';
import { IMAGES } from '@/constants/images';

const UserCreatedArticleDetails = ({ articleId }) => {
  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['selectedUserArticle', articleId],
    queryFn: () => articlesApi.getArticle({id:articleId}),
    enabled: !!articleId, // Zapytanie wysyłane tylko, gdy przekazano articleId
  });

  if (isLoading) {
    return <div>Ładowanie szczegółów artykułu...</div>;
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
    // <div className="p-4 space-y-4 ">
    //   <h1 className="text-xl font-bold">{article.title}</h1>
    //   <div className="text-gray-600">
    //     <p><strong>Opis pracownika:</strong> {article.employeeDescription}</p>
    //     <p><strong>Opis klienta:</strong> {article.clientDescription}</p>
    //   </div>
    //   <div>
    //     <p><strong>Zweryfikowany:</strong> {article.isVerified ? 'Tak' : 'Nie'}</p>
    //     <p><strong>Zweryfikował:</strong> {article.verifiedBy?.name || 'Nieznany użytkownik'}</p>
    //   </div>
    //   <div>
    //     <p><strong>Produkt:</strong> {article.product?.name || 'Nieznany produkt'}</p>
    //     <p><strong>Tagi:</strong> {article.tags.map(tag => tag.name).join(', ') || 'Brak'}</p>
    //     <p><strong>Wyświetlenia:</strong> {article.viewsCounter}</p>
    //   </div>
    //   <p className="text-gray-400 text-sm">
    //     Utworzono: {new Date(article.createdAt).toLocaleString()}
    //   </p>
    // </div>
    <ArticleDetailsCardLite article={article}/>
  );
};

export default UserCreatedArticleDetails;
