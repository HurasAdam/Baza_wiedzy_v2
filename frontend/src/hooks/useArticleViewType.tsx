import { useState, useEffect } from 'react';

function useArticleViewType(key, initialValue) {
  const [viewType, setViewType] = useState(() => {
    const savedView = localStorage.getItem(key);
    return savedView || initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, viewType);
  }, [key, viewType]);

  // Funkcja do zmiany widoku
  const updateViewType = (newViewType) => {
    setViewType(newViewType);
    localStorage.setItem(key, newViewType);
  };

  return [viewType, updateViewType];
}

export default useArticleViewType;