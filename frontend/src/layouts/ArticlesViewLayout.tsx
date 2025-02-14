import ArticlesGridView from "@/components/ArticlesGridView";
import ArticlesTableView from "@/components/ArticlesTableView";
import ARTICLES_VIEW_TYPE from "@/enums/articlesViewType";
import useMarkArticleAsFavourite from "@/hooks/useMarkArticleAsFavourite";
import React from "react";

const ArticlesViewLayout: React.FC = ({ viewType, articles,isLoading }) => {
  const { mutate: markAsFavouriteHandler } =
    useMarkArticleAsFavourite();

  const toggleAsFavourite = ({ id }) => {
    markAsFavouriteHandler({ id });
  };

  return (
    <div>
      {viewType === ARTICLES_VIEW_TYPE.GRID && (
        <ArticlesGridView
          articles={articles}
          selectedView={viewType}
          isLoading={isLoading}
          toggleAsFavourite={toggleAsFavourite}
        />
      )}

      {viewType === ARTICLES_VIEW_TYPE.TABLE && (
        <ArticlesTableView
          articles={articles}
          selectedView={viewType}
          isLoading={isLoading}
          toggleAsFavourite={toggleAsFavourite}
        />
      )}
    </div>
  );
};

export default ArticlesViewLayout;
