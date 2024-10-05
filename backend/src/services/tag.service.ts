import { CONFLICT } from "../constants/http";
import TagModel from "../models/Tag.model";
import appAssert from "../utils/appAssert";

interface CreateArticleRequest {
    name: string;

  }


interface CreateTagParams {
    request: CreateArticleRequest;
    userId: string; // Zakładam, że userId to string
  }

export const createTag = async({request, userId}:CreateTagParams)=>{
    const {name} = request;

    const tag = await TagModel.exists({name});
    appAssert(!tag, CONFLICT, "Tag already exists");

    const createdTag = await TagModel.create({
        name,
        createdBy:userId
    })
    return createdTag;
}