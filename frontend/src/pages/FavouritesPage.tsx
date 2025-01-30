import { articlesApi } from '@/lib/articlesApi'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react';
import { FaStar } from "react-icons/fa";

const FavouritesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('') // Kontrola pola wyszukiwania

  // Pobranie artykułów
  const { data: articles } = useQuery({
    queryKey: ['articles'],
    queryFn: () => {
      return articlesApi.getUserFavouritesArticles()
    },
  })

  // Filtracja artykułów na podstawie searchBar
  const filteredArticles = articles?.data?.filter((article: any) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-[1640px] px-2.5 mx-auto grid grid-cols-[9fr_3fr] gap-8">
        {/* Lista artykułów (lewa kolumna) */}
        <div>
          <div className='flex items-center mb-6 gap-2'>
          <FaStar className='w-5 h-5'/>
          <h1 className="text-2xl font-bold text-gray-800  ">
           
            Ulubione Artykuły</h1>
           
            </div>
          <div className="space-y-2">
            {filteredArticles?.map((article: any) => (
              <div
                key={article._id}
                className="pt-4 pb-3.5 px-5 bg-white cursor-pointer  shadow-sm hover:shadow-lg transition-shadow-md duration-200 border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Tytuł artykułu */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h2>

                {/* Informacje o produkcie */}
                <div className="flex items-center mt-2">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: article.product.labelColor }}
                  />
                  <span className="text-gray-600 text-sm font-medium">
                    {article.product.name}
                  </span>
                </div>

                {/* Wyświetlanie tagów */}
                <div className="flex flex-wrap mt-2">
                  {article.tags?.map((tag: any) => (
                    <span
                      key={tag._id}
                      className="bg-gray-200 text-gray-600 text-xs font-medium py-1 px-2 rounded-lg mr-2 mb-2"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                {/* Status weryfikacji */}
                <div className="mt-2">
                  <span
                    className={`text-sm font-medium ${
                      article.isVerified ? 'text-green-500' : 'text-amber-600'
                    }`}
                  >
                    {article.isVerified ? 'Zweryfikowane' : 'Wymaga weryfikacji'}
                  </span>
                </div>

         
              </div>
            ))}

            {/* Jeżeli brak wyników */}
            {!filteredArticles?.length && (
              <p className="text-gray-600 text-center mt-10">
                Nie znaleziono żadnych artykułów spełniających kryteria wyszukiwania.
              </p>
            )}
          </div>
        </div>

        {/* Search Bar (prawa kolumna) */}
        <aside className="bg-white p-4 rounded-lg shadow-md h-auto max-h-[300px] overflow-auto sticky top-[60px]">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filtruj</h2>
          <div className="space-y-3.5">
            <input
              type="text"
              placeholder="Szukaj artykułów..."
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}

export default FavouritesPage
