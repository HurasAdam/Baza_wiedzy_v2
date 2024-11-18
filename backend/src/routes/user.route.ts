import { Router } from "express";
import { getUserHandler, getUsersHandler, getUsersWithReportCountHandler } from "../controllers/user.controller";
import { getSessionsHandler } from "../controllers/session.controller";

 const userRoutes = Router();

//prefix: /user

userRoutes.get("/",getUserHandler);
userRoutes.get("/users",getUsersHandler);
userRoutes.get("/statistics",getUsersWithReportCountHandler);

export default userRoutes;