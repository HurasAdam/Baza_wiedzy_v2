import ArticlesInlineView from "@/components/articles/views/InlineView/ArticlesInlineView";
import ArticlesSideBySideView from "@/components/articles/views/SideBySideView/ArticlesSideBySideView";
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
        <ArticlesSideBySideView
          articles={articles}
          selectedView={viewType}
          isLoading={isLoading}
          toggleAsFavourite={toggleAsFavourite}
        />
      )}

      {viewType === ARTICLES_VIEW_TYPE.TABLE && (
        <ArticlesInlineView
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
