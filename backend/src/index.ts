import 'dotenv/config';
import mongoose from 'mongoose';
import Log from 'simpl-loggar';
import connectDB from './config/db.js';
import startServer from './server/index.js';
import type http from 'http';

let app: http.Server | undefined = undefined;

const start = async (): Promise<void> => {
  await connectDB();
  app = startServer();
};

const close = (): void => {
  if (app) app.close();
  mongoose.disconnect().catch((err) => {
    Log.error('Mongoose', 'Got error while disconnecting from mongoose', (err as Error).message);
  });
};

start()
  .then(() => {
    Log.log('App', 'App started');
  })
  .catch((err) => {
    Log.error('App', (err as Error).message, (err as Error).stack);
    close();
  });
