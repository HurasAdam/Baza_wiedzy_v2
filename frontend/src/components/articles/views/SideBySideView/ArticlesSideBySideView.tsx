import  {useState } from 'react';
import SideBySideArticleDetails from './SideBySideArticleDetails';
import SideBySideArticlesList from './SideBySideArticlesList';
import SideBySideFilterBar from './SideBySideFilterBar';


const ArticlesSideBySideView = ({articles}) => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
   
<div>
<SideBySideFilterBar/>
<div className="grid grid-cols-[8fr_12fr] h-[calc(100vh-60px)] bg-gray-50 gap-3.5 px-10  ">
     
     <SideBySideArticlesList onSelect={setSelectedArticle} articles={articles} />
     
     <SideBySideArticleDetails articleId={selectedArticle}  />
   </div>
</div>

    
  );
};

export default ArticlesSideBySideView;
