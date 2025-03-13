import { Router } from 'express';
import {
getUserNotifications
} from './controller.js';

const notificationRoutes = Router();

// prefix /notifications

notificationRoutes.get('/', getUserNotifications);


export default notificationRoutes;
