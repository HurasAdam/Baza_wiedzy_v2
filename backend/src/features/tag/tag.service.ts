import { CONFLICT } from "../../constants/http";
import TagModel from "./tag.model";
import appAssert from "../../utils/appAssert";

interface CreateArticleRequest {
    name: string;
}

interface CreateTagParams {
    request: CreateArticleRequest;
    userId: string; // Zakładam, że userId to string
}

export const TagService = {
    createTag: async ({ request, userId }: CreateTagParams) => {
        const { name } = request;

        const tag = await TagModel.exists({ name });
        appAssert(!tag, CONFLICT, "Tag already exists");

        const createdTag = await TagModel.create({
            name,
            createdBy: userId,
        });
        return { data: createdTag, message: "Tag został dodany" };
    },

    getTag: async ({ tagId }: { tagId: string }) => {
        const tag = await TagModel.findById({ _id: tagId });
        return tag;
    },

    find: async (query) => {
        const querydb: any = {
            isDefault: false,
        };

        const name = query.name?.trim();

        if (name) {
            querydb.name = new RegExp(name, "i");
        }

        const tags = await TagModel.aggregate([
            { $match: querydb },
            {
                $lookup: {
                    from: "articles",
                    localField: "_id",
                    foreignField: "tags",
                    as: "articleLinks",
                },
            },
            {
                $addFields: {
                    isUsed: { $gt: [{ $size: "$articleLinks" }, 0] },
                },
            },
            { $unset: "articleLinks" },
        ]);

        const totalCount = await TagModel.countDocuments(querydb);

        return {
            tags,
            totalCount,
        };
    },
};
