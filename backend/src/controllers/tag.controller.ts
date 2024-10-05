import { OK } from "../constants/http";
import ArticleModel from "../models/Article.model";
import TagModel from "../models/Tag.model";
import { createTag } from "../services/tag.service";
import catchErrors from "../utils/catchErrors";
import { newTagSchema } from "./tag.schema";

export const createTagHandler = catchErrors(
    async(req,res)=>{
        const request = newTagSchema.parse(req.body);
        const {userId} = req
        const newTag= await createTag({request, userId});

console.log(newTag);
return res.status(OK).json(newTag)

    }
)


export const getTagsHandler = catchErrors(
    async(req,res)=>{
       

        const tags = await TagModel.find({}).select(["-createdBy"]);
        return res.status(OK).json(tags)
    }
)