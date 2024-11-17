import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandlers";
import catchErrors from "./utils/catchErrors";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import authenticate from "./middleware/authenticate";
import sessionRoutes from "./routes/session.route";
import articleRoutes from "./routes/article.route";
import tagRoutes from "./routes/tag.route";
import conversationTopicRoutes from "./routes/conversationTopic.route";
import conversationReportRoutes from "./routes/conversationReport.route";



const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: APP_ORIGIN,
    credentials:true,
}))
app.use(cookieParser());


app.get(
    "/",
    catchErrors( async(req,res,next)=>{
 
        return res.status(OK).json("Test")
    })
)

app.use("/auth", authRoutes);

//protected routes
app.use("/user", authenticate,userRoutes);
app.use("/sessions", authenticate,sessionRoutes);
app.use("/articles",authenticate, articleRoutes);
app.use("/tags",authenticate, tagRoutes);
app.use("/conversation-topics",authenticate, conversationTopicRoutes);
app.use("/conversation-report",authenticate, conversationReportRoutes);

app.use(errorHandler);

connectDB(()=>{
    app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`)
})
})




