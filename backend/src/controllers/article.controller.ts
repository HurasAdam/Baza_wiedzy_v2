
import { OK } from "../constants/http";
import ArticleModel from "../models/Article.model";
import { createArticle } from "../services/article.service";
import catchErrors from "../utils/catchErrors";
import { newArticleSchema } from "./article.schemas";

export const createArticleHandler = catchErrors(
    async(req,res)=>{
    const request = newArticleSchema.parse(req.body);
    const {userId} = req
    const newArticle = await createArticle({request, userId});



    return res.status(OK).json(newArticle)
    }

    
)



export const getArticlesHandler = catchErrors(
    async (req,res) => {
   
    const allArticles = await ArticleModel.find({});
    return res.status(OK).json(allArticles);
  
    }
)