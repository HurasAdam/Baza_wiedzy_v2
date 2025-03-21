import { startOfDay, subDays } from "date-fns";
import catchErrors from "@/utils/catchErrors";
import ArticleModel from "@/features/article/article.model";
import ArticleHistoryModel from "@/features/article-history/article-history.model";
import ConversationReportModel from "@/features/conversation-report/conversation-report.model";

export const DashboardController = () => ({
    stats: catchErrors(async (req, res) => {
        const { range } = req.query;
        let startDate;
        const endDate = new Date(); // Current date

        // Determine start date based on the range
        if (range === "today") {
            startDate = startOfDay(new Date());
        } else if (range === "last7days") {
            startDate = subDays(endDate, 7);
        } else if (range === "last30days") {
            startDate = subDays(endDate, 30);
        } else {
            return res.status(400).json({ message: "Invalid range parameter" });
        }

        const articleCount = await ArticleModel.countDocuments({
            isTrashed: false,
            createdAt: { $gte: startDate, $lte: endDate }, // Added date filter
        });

        // Filter conversations based on the date range
        const conversationCount = await ConversationReportModel.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }, // Added date filter
        });

        const editedArticlesCount = await ArticleHistoryModel.countDocuments({
            eventType: "updated",
            updatedAt: { $gte: startDate, $lte: endDate },
        });

        return res.status(200).json({
            addedArticles: articleCount,
            recordedConversations: conversationCount,
            editedArticles: editedArticlesCount,
        });
    }),

    statsByUser: catchErrors(async (req, res) => {
        const { userId } = req;
        const { range } = req.query;
        let startDate;
        const endDate = new Date(); // Aktualna data

        // Określenie startDate w zależności od zakresu (range)
        if (range === "today") {
            startDate = startOfDay(new Date()); // Początek dzisiejszego dnia
        } else if (range === "last7days") {
            startDate = subDays(endDate, 7); // Ostatnie 7 dni
        } else if (range === "last30days") {
            startDate = subDays(endDate, 30); // Ostatnie 30 dni
        } else {
            return res.status(400).json({ message: "Invalid range parameter" });
        }

        // Statystyki dla użytkownika na podstawie daty
        const userConversations = await ConversationReportModel.countDocuments({
            createdBy: userId,
            createdAt: { $gte: startDate, $lte: endDate }, // Filtrowanie po dacie
        });

        const userArticles = await ArticleModel.countDocuments({
            createdBy: userId,
            createdAt: { $gte: startDate, $lte: endDate }, // Filtrowanie po dacie
        });

        // Liczba edytowanych artykułów przez użytkownika
        const userEditedArticles = await ArticleHistoryModel.countDocuments({
            articleId: { $exists: true },
            updatedBy: userId,
            eventType: "updated",
            updatedAt: { $gte: startDate, $lte: endDate },
        });

        return res.status(200).json({
            userConversations,
            userArticles,
            userEditedArticles,
        });
    }),
});
