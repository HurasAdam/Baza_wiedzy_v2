import { OK } from "../../constants/http";
import catchErrors from "../../utils/catchErrors";
import changelogData from "./changelogData.json";
export const ChangelogController = () => ({
    find: catchErrors(async ({ query }, res) => {
        res.status(OK).json(changelogData);
    }),
});
