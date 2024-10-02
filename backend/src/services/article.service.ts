import { CONFLICT } from "../constants/http";
import ArticleModel from "../models/Article.model";
import appAssert from "../utils/appAssert";


interface CreateArticleRequest {
    title: string;
    employeeDescription: string;
    tags: string[];
    clientDescription: string;
  }
  
  interface CreateArticleParams {
    request: CreateArticleRequest;
    userId: string; // Zakładam, że userId to string
  }


export const createArticle = async({request,userId}:CreateArticleParams)=>{
const {title,employeeDescription,tags,clientDescription} = request;

const article = await ArticleModel.exists({ title });
appAssert(!article, CONFLICT, "Article already exists");

console.log("request");
console.log(request);

const createdArticle = await ArticleModel.create({
    title,
    employeeDescription,
    clientDescription,
    tags,
    createdBy:userId,
    verifiedBy:userId
})
return createdArticle
};



// ARTICLES


interface GetArticlesOptions {
    title?: string;
    tags?: string[];
    author?: string;
    verified?: boolean;
    limit: number;
    page: number;
    sortBy: string;
  }
  
  export const getAllArticles = async (options: GetArticlesOptions) => {
    const { title, tags, author, verified, limit, page, sortBy } = options;
    
    const query: any = {};
  
    // Konstruowanie zapytania
    if (title) {
      query.title = new RegExp(title, "i");
    }
  
    if (tags) {
      query.tags = { $all: tags };
    }
  
    if (author) {
      query.createdBy = author;
    }
  
    if (verified !== undefined) {
      query.isVerified = verified;
    }
  
    const pageSize = limit;
    const skipp = (page - 1) * pageSize;
  
    const articles = await ArticleModel.find(query)
      .select([
        "-clientDescription",
        "-employeeDescription",
        "-verifiedBy",
        "-updatedAt",
        "-viewsCounter",
        "-__v",
      ])
      .populate([
        { path: "tags", select: ["name", "shortname"] },
        { path: "createdBy", select: ["name", "surname"] },
      ])
      .skip(skipp)
      .limit(pageSize)
      .sort(sortBy);
  
    const total = await ArticleModel.countDocuments(query);
  
    return {
      articles,
      total,
      pages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  };