import { Router } from "express";

import { NetworkToolsController } from "./network-tools.controller";

export const networkToolsRoutes = Router();
const networkToolsController = NetworkToolsController();

// prefix /network-tools

networkToolsRoutes.get("/dns-lookup", networkToolsController.dnsLookup);
