
import { CONFLICT, OK } from "../constants/http";
import ArticleModel from "../models/Article.model";
import { createArticle, getArticle } from "../services/article.service";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { constructSearchQuery } from "../utils/constructSearchQuery";
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
   
        const query = constructSearchQuery(req.query);


        const limit = parseInt(req.query.limit?.toString() || "20")
    const pageSize = limit;
        const pageNumber = parseInt(
          req.query.page ? req.query.page.toString() : "1"
        );
        const skipp = (pageNumber - 1) * pageSize;
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : '-createdAt';
        const articles = await ArticleModel.find(query)
          .select([
            "-clientDescription",
            "-employeeDescription",
            "-verifiedBy",
            "-updatedAt",
            "-viewsCounter",
            "-__v",
          ])
          .populate([{ path: "tags", select: ["name","shortname"] },{path:"createdBy",select:["name","surname"]}])
          .skip(skipp)
          .limit(pageSize)
          .sort(sortBy); 
    
        const total = await ArticleModel.countDocuments(query);
    
        const responseObject = {
          data: articles,
          pagination: {
            total,
            page: pageNumber,
            pages: Math.ceil(total / pageSize),
          },
        };
    
        
    return res.status(OK).json(responseObject);
  
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


export const verifyArticleHandler = catchErrors(
  async(req,res)=>{
    const {id} = req.params;
    const {isVerified} = req.body;

    const article = await ArticleModel.findById({_id:id})

    appAssert(article, CONFLICT, "Article not found");

    article.isVerified = isVerified;
    await article.save();
    res.status(OK).json({message:`${isVerified ? "Artykuł został zweryfikowany" :"Artykuł został oznaczony jako do weryfikacji"}`})
  }
)