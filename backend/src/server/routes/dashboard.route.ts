import { Router } from 'express';
import { getDashboardStatsHandler, getUserDashboardStatsHandler } from '../../controllers/dashboard.controller.js';

const dashboardRoutes = Router();

// prefix /tags

dashboardRoutes.get('/stats', getDashboardStatsHandler);
dashboardRoutes.get('/userStats', getUserDashboardStatsHandler);

export default dashboardRoutes;
