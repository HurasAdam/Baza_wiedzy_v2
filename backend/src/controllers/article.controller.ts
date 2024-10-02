
import { OK } from "../constants/http";
import { createArticle, getAllArticles } from "../services/article.service";
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
   
        const limit = parseInt(req.query.limit?.toString() || "20");
        const page = parseInt(req.query.page?.toString() || "1");
        const sortBy = req.query.sortBy?.toString() || "-createdAt";
        

        const tags = Array.isArray(req.query.tags)
        ? req.query.tags.map(tag => tag.toString()) 
        : req.query.tags
        ? [req.query.tags.toString()]  
        : [];

        // Konstruowanie opcji do serwisu
        const options = {
          title: req.query.title?.toString(),
          tags: tags,
          author: req.query.author?.toString(),
          verified: req.query.verified ? req.query.verified === "true" : undefined,
          limit,
          page,
          sortBy,
        };
    
        const { articles, total, pages, currentPage } = await getAllArticles(options);
    
        const responseObject = {
          data: articles,
          pagination: {
            total,
            page: currentPage,
            pages,
          },
        };
    
        res.status(200).json(responseObject);
  
    }
)