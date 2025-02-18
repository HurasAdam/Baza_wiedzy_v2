import React from 'react'
import { FaRedo, FaFilter, FaSearch } from 'react-icons/fa'

const SideBySideFilterBar = () => {
  return (
    <div className="flex items-center bg-white shadow-md py-5 px-12 rounded-lg mb-6 space-x-6 ">
      
      {/* Wyszukiwarka */}
      <div className="relative w-1/4">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Wyszukaj artykuł..."
          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Selekcja produktu i kategorii */}
      <div className="flex space-x-4 flex-1">
        <select className="w-1/2 p-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
          <option value="">Wybierz produkt</option>
          <option value="Product1">Produkt 1</option>
          <option value="Product2">Produkt 2</option>
          <option value="Product3">Produkt 3</option>
        </select>
        <select className="w-1/2 p-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
          <option value="">Wybierz kategorię</option>
          <option value="Category1">Kategoria 1</option>
          <option value="Category2">Kategoria 2</option>
          <option value="Category3">Kategoria 3</option>
        </select>
      </div>

      {/* Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="h-5 w-5 text-blue-600 border-gray-200 rounded focus:ring-2 focus:ring-blue-500 transition"
        />
        <span className="text-sm text-gray-700">Tylko zweryfikowane</span>
      </div>

      {/* Przyciski */}
      <div className="flex space-x-2">
        <button className="flex items-center space-x-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-md shadow hover:bg-blue-700 transition">
          <FaFilter />
          <span>Filtruj</span>
        </button>
        <button className="flex items-center space-x-2 bg-red-600 text-white text-sm px-4 py-2 rounded-md shadow hover:bg-red-700 transition">
          <FaRedo />
          <span>Reset</span>
        </button>
      </div>
      
    </div>
  )
}

export default SideBySideFilterBar
