import { useQuery } from "@tanstack/react-query";
import { tagsApi } from "../../lib/tagsApi";

const TagsPage = () => {
    const { data: tags } = useQuery({
        queryKey: ["tags"],
        queryFn: () => {
            return tagsApi.getAllTags();
        },
    });
    return <div>TagsPage</div>;
};

export default TagsPage;
