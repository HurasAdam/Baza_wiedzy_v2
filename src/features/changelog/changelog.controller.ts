import { OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import changelogData from "./changelogData.json";
export const ChangelogController = () => ({
    find: catchErrors(async ({ query }, res) => {
        const sortedChangelog = [...changelogData].reverse();
        res.status(OK).json(sortedChangelog);
    }),
});
