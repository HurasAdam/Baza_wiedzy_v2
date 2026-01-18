import cron from "node-cron";
import { ArticleService } from "../features/article/article.service";

export const startArticleReviewJob = () => {
    cron.schedule("0 3 * * *", async () => {
        try {
            console.log("[CRON] Article review job triggered");

            const count = await ArticleService.expireApprovedArticles();

            console.log(`[CRON] Articles expired: ${count}`);
        } catch (err) {
            console.error("[CRON] Article expiration failed", err);
        }
    });
};
