import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import Log from 'simpl-loggar';
import authenticate from './middleware/authenticate.js';
import errorHandler from './middleware/errorHandlers.js';
import getConfig from '../../constants/index.js';
import initWebsocketServer from '../websocket/index.js';
import articleRoutes from './modules/article/index.js';
import authRoutes from './modules/auth/index.js';
import conversationReportRoutes from './modules/conversationReport/index.js';
import conversationTopicRoutes from './modules/conversationTopic/index.js';
import dashboardRoutes from './modules/dashboard/index.js';
import notificationRoutes from './modules/notification/index.js';
import productRoutes from './modules/product/index.js';
import sessionRoutes from './modules/session/index.js';
import tagRoutes from './modules/tag/index.js';
import userRoutes from './modules/user/index.js';
import http from 'http';

const initUnprotectedRoutes = (app: express.Express): void => {
  app.use('/auth', authRoutes());
};

const initProtectedRoutes = (app: express.Express): void => {
  // protected routes
  app.use('/user', authenticate, userRoutes());
  app.use('/sessions', authenticate, sessionRoutes());
  app.use('/articles', authenticate, articleRoutes());
  app.use('/tags', authenticate, tagRoutes());
  app.use('/products', authenticate, productRoutes());
  app.use('/conversation-topics', authenticate, conversationTopicRoutes());
  app.use('/conversation-report', authenticate, conversationReportRoutes());
  app.use('/dashboard', authenticate, dashboardRoutes());
  app.use('/notifications', authenticate, notificationRoutes());
};

const initRoutes = (app: express.Express): void => {
  initUnprotectedRoutes(app);
  initProtectedRoutes(app);
};

const initMiddleware = (app: express.Express): void => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: getConfig().APP_ORIGIN,
      credentials: true,
    }),
  );
  app.use(cookieParser());
};

const initErrorHandler = (app: express.Express): void => {
  app.use(errorHandler);
};

const initServer = (app: express.Express): http.Server => {
  const server = http.createServer(app);

  server.listen(getConfig().PORT, () => {
    Log.log('Server', `Listening on ${getConfig().PORT}`);
  });

  return server;
};

export default (server?: express.Express): http.Server => {
  const app = server ?? express();

  initMiddleware(app);
  initRoutes(app);
  initErrorHandler(app);
  initWebsocketServer();
  return initServer(app);
};
