import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import Log from 'simpl-loggar';
import connectDB from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import { OK } from './constants/http';
import authenticate from './middleware/authenticate';
import errorHandler from './middleware/errorHandlers';
import articleRoutes from './routes/article.route';
import authRoutes from './routes/auth.route';
import conversationReportRoutes from './routes/conversationReport.route';
import conversationTopicRoutes from './routes/conversationTopic.route';
import dashboardRoutes from './routes/dashboard.route';
import productRoutes from './routes/product.route';
import sessionRoutes from './routes/session.route';
import tagRoutes from './routes/tag.route';
import userRoutes from './routes/user.route';
import catchErrors from './utils/catchErrors';

const handleStart = async (): Promise<void> => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: APP_ORIGIN,
      credentials: true,
    }),
  );
  app.use(cookieParser());

  app.get(
    '/',
    catchErrors(async (req, res, next) => {
      return res.status(OK).json('Test');
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

  app.use(errorHandler);

  connectDB(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
    });
  });
};

handleStart()
  .then(() => {
    Log.log('App', 'App started');
  })
  .catch((err) => {
    Log.error('App', (err as Error).message, (err as Error).stack);
  });
