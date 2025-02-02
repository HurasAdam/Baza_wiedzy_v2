import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import Log from 'simpl-loggar';
import authenticate from './middleware/authenticate.js';
import errorHandler from './middleware/errorHandlers.js';
import { PORT, APP_ORIGIN } from '../constants/index.js';
import { EHttpCodes } from '../enums/index.js';
import articleRoutes from '../routes/article.route.js';
import authRoutes from '../routes/auth.route.js';
import conversationReportRoutes from '../routes/conversationReport.route.js';
import conversationTopicRoutes from '../routes/conversationTopic.route.js';
import dashboardRoutes from '../routes/dashboard.route.js';
import productRoutes from '../routes/product.route.js';
import sessionRoutes from '../routes/session.route.js';
import tagRoutes from '../routes/tag.route.js';
import userRoutes from '../routes/user.route.js';
import catchErrors from '../utils/catchErrors.js';
import http from 'http';

const initRoutes = (app: express.Express): void => {
  app.get(
    '/',
    catchErrors((_req: express.Request, res: express.Response, _next: express.NextFunction) => {
      return res.status(EHttpCodes.OK).json('Test');
    }),
  );

  app.use('/auth', authRoutes);

  // protected routes
  app.use('/user', authenticate, userRoutes);
  app.use('/sessions', authenticate, sessionRoutes);
  app.use('/articles', authenticate, articleRoutes);
  app.use('/tags', authenticate, tagRoutes);
  app.use('/products', authenticate, productRoutes);
  app.use('/conversation-topics', authenticate, conversationTopicRoutes);
  app.use('/conversation-report', authenticate, conversationReportRoutes);
  app.use('/dashboard', authenticate, dashboardRoutes);
};

const initMiddleware = (app: express.Express): void => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: APP_ORIGIN,
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

  server.listen(PORT, () => {
    Log.log('Server', `Listening on ${PORT}`);
  });

  return server;
};

export default (): http.Server => {
  const app = express();

  initMiddleware(app);
  initRoutes(app);
  initErrorHandler(app);

  return initServer(app);
};
