import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from "./middleware/errorHandlers";
import authenticate from "./middleware/authenticate";
import { authRoutes } from "./features/auth/auth.route";
import { userRoutes } from "./features/user/user.route";
import { sessionRoutes } from "./features/session/session.route";
import { articleRoutes } from "./features/article/article.route";
import { tagRoutes } from "./features/tag/tag.route";
import { conversationTopicRoutes } from "./features/conversation-topic/conversation-topic.route";
import { conversationReportRoutes } from "./features/conversation-report/conversation-report.route";
import { productRoutes } from "./features/product/product.route";
import { dashboardRoutes } from "./features/dashboard/dashboard.route";

const app = express();
app.use(express.json());
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
app.use("/user", authenticate, userRoutes);
app.use("/sessions", authenticate, sessionRoutes);
app.use("/articles", authenticate, articleRoutes);
app.use("/tags", authenticate, tagRoutes);
app.use("/products", authenticate, productRoutes);
app.use("/conversation-topics", authenticate, conversationTopicRoutes);
app.use("/conversation-report", authenticate, conversationReportRoutes);
app.use("/dashboard", authenticate, dashboardRoutes);

app.use(errorHandler);

connectDB(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
    });
});
