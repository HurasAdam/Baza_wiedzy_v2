import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import path from "node:path";
import { Server as IOServer } from "socket.io";
import connectDB from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import { adminRoutes } from "./features/admin/admin.route";
import { articleHistoryRoutes } from "./features/article-history/articleHistory.route";
import { articleUserFlagRoutes } from "./features/article-user-flag/articleUserFlag.route";
import { articleViewRoute } from "./features/article-view/articleView.route";
import { articleRoutes } from "./features/article/article.route";
import { attachmentRoutes } from "./features/attachment/attachment.route";
import { authRoutes } from "./features/auth/auth.route";
import { categoryRoutes } from "./features/category/category.route";
import { conversationReportRoutes } from "./features/conversation-report/conversation-report.route";
import { conversationTopicRoutes } from "./features/conversation-topic/conversation-topic.route";
import { dashboardRoutes } from "./features/dashboard/dashboard.route";
import { departmentRoutes } from "./features/department/department.route";
import { faqItemRoutes } from "./features/faq-item/faq-item.route";
import { faqRoutes } from "./features/faq/faq.route";
import { flagRoutes } from "./features/flag/flag.route";
import { funnyMessageRoutes } from "./features/funny-message/funny-message.route";
import { IssueReportRoutes } from "./features/issue-report/issueReport.route";
import { notificationRoutes } from "./features/notification/notification.route";
import { productRoutes } from "./features/product/product.route";
import { projectRoutes } from "./features/project/project.route";
import { statisticsRoutes } from "./features/statistics/statistics.route";
import { tagRoutes } from "./features/tag/tag.route";
import { userRoutes } from "./features/user/user.route";
import { workspaceArticleRoutes } from "./features/workspace-article/workspace-article.route";
import { workspaceFolderRoutes } from "./features/workspace-folder/workspace-folder.routes";
import { workspaceMemberRoutes } from "./features/workspace-member/workspace-member.routes";
import { workspaceRoutes } from "./features/workspace/workspace.route";
import authenticate from "./middleware/authenticate";
import errorHandler from "./middleware/errorHandlers";

const app = express();

const server = http.createServer(app);

export const io = new IOServer(server, {
    cors: {
        origin: APP_ORIGIN,
        credentials: true,
    },
});

const onlineUsers: Map<string, any> = new Map();

io.on("connection", (socket) => {
    console.log("Nowy użytkownik połączony:", socket.id);

    socket.on("register-user", (userId: string) => {
        if (!userId) return;

        socket.join(`user:${userId}`);
        console.log(`++ Użytkownik ${userId} dołączył do pokoju user:${userId}`);
    });

    socket.on("disconnect", () => {
        console.log("-- Użytkownik się rozłączył:", socket.id);
    });
});

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
    })
);
app.use(cookieParser());

app.use("/auth", authRoutes);

//#protected routes
app.use("/users", authenticate, userRoutes);
app.use("/statistics", authenticate, statisticsRoutes);
app.use("/notifications", authenticate, notificationRoutes);
app.use("/admin", authenticate, adminRoutes);
app.use("/articles", authenticate, articleRoutes);
app.use("/articles-history", authenticate, articleHistoryRoutes);
app.use("/article-views", authenticate, articleViewRoute);
app.use("/tags", authenticate, tagRoutes);
app.use("/categories", authenticate, categoryRoutes);
app.use("/products", authenticate, productRoutes);
app.use("/conversation-topics", authenticate, conversationTopicRoutes);
app.use("/conversation-report", authenticate, conversationReportRoutes);
app.use("/departments", authenticate, departmentRoutes);
app.use("/projects", authenticate, projectRoutes);
app.use("/flags", authenticate, flagRoutes);
app.use("/article-user-flag", authenticate, articleUserFlagRoutes);
app.use("/dashboard", authenticate, dashboardRoutes);
app.use("/issue-report", authenticate, IssueReportRoutes);
app.use("/funny-messages", authenticate, funnyMessageRoutes);
app.use("/faq", authenticate, faqRoutes);
app.use("/faq-item", authenticate, faqItemRoutes);
app.use("/attachments", authenticate, attachmentRoutes);
app.use("/workspaces", authenticate, workspaceRoutes);
app.use("/workspace-folders", authenticate, workspaceFolderRoutes);
app.use("/workspace-articles", authenticate, workspaceArticleRoutes);
app.use("/workspace-members", authenticate, workspaceMemberRoutes);

const uploadsPath = path.resolve("/app/uploads");
app.use(
    "/uploads",
    express.static(uploadsPath, {
        setHeaders: (res, filePath) => {
            if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
                res.setHeader("Content-Type", "image/jpeg");
            } else if (filePath.endsWith(".png")) {
                res.setHeader("Content-Type", "image/png");
            } else if (filePath.endsWith(".svg")) {
                res.setHeader("Content-Type", "image/svg+xml");
            }
        },
    })
);

app.use(errorHandler);

connectDB(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
    });
});
