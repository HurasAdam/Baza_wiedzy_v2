import ArticlesFeedViewContainer from "@/components/articles/views/feedView/ArticlesFeedViewContainer";
import ArticlesSplitView from "../components/articles/views/splitView/ArticlesSplitView";
import ArticlesTableView from "../components/articles/views/tableView/ArticlesTableView";
import { useViewPref } from "../contexts/ViewPreferenceContext";

const ArticlesPage: React.FC = () => {
    const { viewPreference } = useViewPref();

    // Dodanie logiki dla "TableView"
    if (viewPreference === "mailing") {
        return <ArticlesSplitView />;
    } else if (viewPreference === "default") {
        return <ArticlesFeedViewContainer />;
    } else if (viewPreference === "table") {
        return <ArticlesTableView />; // nowy widok dla tabeli
    }

    return null;
};

export default ArticlesPage;
