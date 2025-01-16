import ArticleModel from "../models/Article.model";
import ConversationReportModel from "../models/ConversationReport.model";
import catchErrors from "../utils/catchErrors";
import { startOfDay, subDays } from 'date-fns';

export const getDashboardStatsHandler  = catchErrors(async (req, res) => {

    const {range } = req.query;
    let startDate;
    const endDate = new Date(); // Current date
  
    // Determine start date based on the range
    if (range === 'today') {
      startDate = startOfDay(new Date());
    } else if (range === 'last7days') {
      startDate = subDays(endDate, 7);
    } else if (range === 'last30days') {
      startDate = subDays(endDate, 30);
    } else {
      return res.status(400).json({ message: 'Invalid range parameter' });
    }


    const articleCount = await ArticleModel.countDocuments({
        isTrashed: false,
        createdAt: { $gte: startDate, $lte: endDate }  // Added date filter
      });
    
      // Filter conversations based on the date range
      const conversationCount = await ConversationReportModel.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }  // Added date filter
      });
    
      // Filter edited articles based on the date range
      const editedArticlesCount = await ArticleModel.countDocuments({
        updatedAt: { $ne: null, $gte: startDate, $lte: endDate }  // Added date filter
      });
    
      return res.status(200).json({
        addedArticles: articleCount,
        recordedConversations: conversationCount,
        editedArticles: editedArticlesCount,
      });
  });

  export  const getUserDashboardStatsHandler = catchErrors(async (req,res)=>{
    const {userId} = req
  const {range}= req.query
    let startDate;
    const endDate = new Date();  // Aktualna data
  
    // Określenie startDate w zależności od zakresu (range)
    if (range === 'today') {
      startDate = startOfDay(new Date());  // Początek dzisiejszego dnia
    } else if (range === 'last7days') {
      startDate = subDays(endDate, 7);  // Ostatnie 7 dni
    } else if (range === 'last30days') {
      startDate = subDays(endDate, 30);  // Ostatnie 30 dni
    } else {
      return res.status(400).json({ message: 'Invalid range parameter' });
    }
  
    // Statystyki dla użytkownika na podstawie daty
    const userConversations = await ConversationReportModel.countDocuments({
      createdBy: userId,
      createdAt: { $gte: startDate, $lte: endDate }  // Filtrowanie po dacie
    });
  
    const userArticles = await ArticleModel.countDocuments({
      createdBy: userId,
      createdAt: { $gte: startDate, $lte: endDate }  // Filtrowanie po dacie
    });
  
    const userEditedArticles = await ArticleModel.countDocuments({
      createdBy: userId,
      isVerified: true,
      createdAt: { $gte: startDate, $lte: endDate }  // Filtrowanie po dacie
    });
  
    return res.status(200).json({
      userConversations,
      userArticles,
      userEditedArticles,
    });
  })
  