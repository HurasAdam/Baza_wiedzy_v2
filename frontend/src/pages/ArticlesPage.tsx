import { useViewPref } from "@/contexts/ViewPreferenceContext";
import ArticlesSplitView from "@/components/articles/views/splitView/ArticlesSplitView";
import ArticlesTableView from "@/components/articles/views/tableView/ArticlesTableView";
import { ArticlesFeedView } from "@/components/articles/views/feedView/ArticlesFeedView";

const ArticlesPage = () => {
    const { viewPreference } = useViewPref();

    const viewModes = {
        mailing: <ArticlesSplitView />,
        table: <ArticlesTableView />,
        default: <ArticlesFeedView />,
    };

    return viewModes[viewPreference] || <ArticlesFeedView />;
};

export default ArticlesPage;
