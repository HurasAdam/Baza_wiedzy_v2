import { articlesApi } from '@/lib/articlesApi'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-8xl mx-auto grid grid-cols-[9fr_3fr] gap-8">
        {/* Lista artykułów (lewa kolumna) */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Ulubione Artykuły</h1>
          <div className="space-y-6">
            {filteredArticles?.map((article: any) => (
              <div
                key={article._id}
                className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
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

                {/* Link do szczegółów */}
                <a
                  href={`/products/${article.product._id}`}
                  className="inline-block mt-4 text-blue-500 hover:underline text-sm font-medium"
                >
                  Zobacz szczegóły produktu
                </a>
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
  <div className='space-y-3.5'>
  <input
            type="text"
            placeholder="Szukaj artykułów..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
               <input
            type="text"
            placeholder="Szukaj artykułów..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
