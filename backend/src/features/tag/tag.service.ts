import { CONFLICT, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import TagModel from "./tag.model";
import ArticleModel from "../article/article.model";
import { CreateTagDto } from "./dto/create-tag.dto";
import { SearchTagDto } from "./dto/search-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

export const TagService = {
    async create(userId: string, payload: CreateTagDto) {
        const tag = await TagModel.exists({ name: payload.name });
        appAssert(!tag, CONFLICT, "Tag already exists");

        const createdTag = await TagModel.create({
            ...payload,
            createdBy: userId,
        });

        return createdTag;
    },

    async find(query: SearchTagDto) {
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

    async findOne(id: string) {
        const tag = await TagModel.findById(id);
        appAssert(tag, NOT_FOUND, "Tag not found");

        return tag;
    },

    async updateOne(tagId: string, payload: UpdateTagDto) {
        const { name } = payload;

        const tag = await TagModel.findById(tagId);
        appAssert(tag, NOT_FOUND, "Tag not found");

        // Sprawdź, czy istnieje inny tag z taką samą nazwą
        if (name && name !== tag.name) {
            const existingTag = await TagModel.exists({ name });
            appAssert(!existingTag, CONFLICT, "Tag already exists");
        }

        // Zaktualizuj nazwę tagu
        tag.name = name || tag.name;

        await tag.save();
    },

    async deleteOne(id: string) {
        // Znajdź tag, który próbujesz usunąć
        const tag = await TagModel.findById(id);
        appAssert(tag, NOT_FOUND, "Tag not found");

        // Znajdź artykuły, które mają ten tag
        const articlesWithTag = await ArticleModel.find({ tags: id });

        // Wyszukaj domyślny tag (np. LIBRUS)
        const defaultTag = await TagModel.findOne({
            name: "LIBRUS",
            isDefault: true,
        });
        appAssert(defaultTag, NOT_FOUND, "Domyślny tag nie został znaleziony.");

        // Jeśli artykuł ma tylko jeden tag i jest to tag, który chcemy usunąć
        for (const article of articlesWithTag) {
            if (article.tags.length === 1 && article.tags[0].toString() === id) {
                // Jeśli artykuł ma tylko jeden tag, przypisz domyślny tag i usuń ten tag
                await ArticleModel.updateOne(
                    { _id: article._id },
                    {
                        $addToSet: { tags: defaultTag._id }, // Dodaj domyślny tag
                    }
                );

                // Teraz usuń usuwany tag w osobnej operacji
                await ArticleModel.updateOne(
                    { _id: article._id },
                    { $pull: { tags: id } } // Usuń usuwany tag
                );
            } else {
                // Jeśli artykuł ma więcej niż jeden tag, po prostu usuń tag
                await ArticleModel.updateOne(
                    { _id: article._id },
                    { $pull: { tags: id } } // Usuń usuwany tag
                );
            }
        }

        // Usuń tag z bazy danych
        await TagModel.findByIdAndDelete(id);
    },
};
