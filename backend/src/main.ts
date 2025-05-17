import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import { adminRoutes } from "./features/admin/admin.route";
import { articleRoutes } from "./features/article/article.route";
import { authRoutes } from "./features/auth/auth.route";
import { categoryRoutes } from "./features/category/category.route";
import { conversationReportRoutes } from "./features/conversation-report/conversation-report.route";
import { conversationTopicRoutes } from "./features/conversation-topic/conversation-topic.route";
import { dashboardRoutes } from "./features/dashboard/dashboard.route";
import { departmentRoutes } from "./features/department/department.route";
import { IssueReportRoutes } from "./features/issue-report/issueReport.route";
import { productRoutes } from "./features/product/product.route";
import { projectRoutes } from "./features/project/project.route";
import { tagRoutes } from "./features/tag/tag.route";
import { userRoutes } from "./features/user/user.route";
import authenticate from "./middleware/authenticate";
import errorHandler from "./middleware/errorHandlers";

const app = express();
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
app.use("/admin", authenticate, adminRoutes);
app.use("/articles", authenticate, articleRoutes);
app.use("/tags", authenticate, tagRoutes);
app.use("/categories", authenticate, categoryRoutes);
app.use("/products", authenticate, productRoutes);
app.use("/conversation-topics", authenticate, conversationTopicRoutes);
app.use("/conversation-report", authenticate, conversationReportRoutes);
app.use("/departments", authenticate, departmentRoutes);
app.use("/projects", authenticate, projectRoutes);
app.use("/dashboard", authenticate, dashboardRoutes);
app.use("/issue-report", authenticate, IssueReportRoutes);

app.use(errorHandler);

connectDB(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
    });
});
