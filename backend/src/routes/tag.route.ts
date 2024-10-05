import { Router } from "express";

import { createTagHandler, getTagsHandler } from "../controllers/tag.controller";


const tagRoutes = Router();

// prefix /sessions

tagRoutes.get("/",getTagsHandler)
tagRoutes.post("/create",createTagHandler);



export default tagRoutes;