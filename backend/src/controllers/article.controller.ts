
import { OK } from "../constants/http";
import ArticleModel from "../models/Article.model";
import { createArticle, getArticle } from "../services/article.service";
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
   
    const allArticles = await ArticleModel.find({}).select(["-clientDescription","-employeeDescription"]).populate([
        {path:"tags", select:["name"]}
    ])
    return res.status(OK).json(allArticles);
  
    }
)


export const getArticleHandler = catchErrors(
    async(req,res)=>{
        const {userId}:{userId:string} = req;
        const {id}= req.params;
 console.log(id)
        const article = await getArticle({userId,articleId:id});
        return res.status(OK).json(article);
    }
)