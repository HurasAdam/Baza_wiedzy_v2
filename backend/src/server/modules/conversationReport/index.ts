import { Router } from 'express';
import { addConversationReportHandler, getAllConversationReportsHandler, getAllReports } from './controller.js';

const conversationReportRoutes = Router();

// prefix /conversation-report

conversationReportRoutes.get('/', getAllConversationReportsHandler);
conversationReportRoutes.get('/all', getAllReports);
conversationReportRoutes.post('/add', addConversationReportHandler);

export default conversationReportRoutes;
