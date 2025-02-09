import { Router } from 'express';
import addConversationReport from './add/index.js';
import { getAllConversationReports, getAllReports } from './get/index.js';

const conversationReportRoutes = Router();

// prefix /conversation-report

conversationReportRoutes.get('/', getAllConversationReports());
conversationReportRoutes.get('/all', getAllReports());
conversationReportRoutes.post('/add', addConversationReport());

export default conversationReportRoutes;
