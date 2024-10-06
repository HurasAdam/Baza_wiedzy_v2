import { Router } from "express";
import { getUserHandler, getUsersHandler } from "../controllers/user.controller";
import { getSessionsHandler } from "../controllers/session.controller";

 const userRoutes = Router();

//prefix: /user

userRoutes.get("/",getUserHandler);
userRoutes.get("/users",getUsersHandler);

export default userRoutes;