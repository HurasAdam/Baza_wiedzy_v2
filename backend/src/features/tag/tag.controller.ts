import { CREATED, OK } from "@/constants/http";
import catchErrors from "@/utils/catchErrors";
import { TagService } from "./tag.service";
import { searchTagDto } from "./dto/search-tag.dto";
import { createTagDto } from "./dto/create-tag.dto";
import { updateTagDto } from "./dto/update-tag.dto";

export const TagController = (tagService = TagService) => ({
    create: catchErrors(async ({ userId, body }, res) => {
        const payload = createTagDto.parse(body);
        const tag = await tagService.create(userId, payload);
        return res.status(CREATED).json(tag);
    }),

    find: catchErrors(async ({ query }, res) => {
        const payload = searchTagDto.parse(query);
        const { tags, totalCount } = await tagService.find(payload);
        return res.status(OK).json({ tags, totalCount });
    }),

    findOne: catchErrors(async ({ params }, res) => {
        const tag = await tagService.findOne(params.id);
        return res.status(OK).json(tag);
    }),

    updateOne: catchErrors(async ({ params, body }, res) => {
        const payload = updateTagDto.parse(body);
        await tagService.updateOne(params.id, payload);
        return res.status(OK).json({ message: "Tag został zaktualizowany" });
    }),

    deleteOne: catchErrors(async ({ params }, res) => {
        await tagService.deleteOne(params.id);
        return res.status(OK).json({ message: "Tag został usunięty pomyślnie." });
    }),
});
