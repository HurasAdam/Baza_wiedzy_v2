import { ArticlesFeedView } from "./ArticlesFeedView";
import { ArticlesFeedViewInline } from "./ArticlesFeedViewInline";
import { Button } from "@/components/ui/button";
import { useViewPref } from "@/contexts/ViewPreferenceContext";

const ArticlesFeedViewContainer: React.FC = () => {
    const { viewPreference, setViewPreference, filterPlacement, setFilterPlacement } = useViewPref();

    const renderFeed = () => {
        if (viewPreference === "default" && filterPlacement === "left") {
            return <ArticlesFeedView />;
        } else if (viewPreference === "default" && filterPlacement === "top") {
            return <ArticlesFeedViewInline />;
        }
        return null;
    };

    return <div>{renderFeed()}</div>;
};

export default ArticlesFeedViewContainer;
