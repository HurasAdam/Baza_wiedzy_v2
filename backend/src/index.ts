import 'dotenv/config';
import Log from 'simpl-loggar';
import Mongo from './connections/mongoose/index.js';
import startServer from './connections/server/index.js';
import State from './tools/state.js';

const start = async (): Promise<void> => {
  const mongo = new Mongo();

  State.mongo = mongo;
  State.server = startServer();

  await mongo.init();
};

const close = (): void => {
  if (State.server) State.server.close();
  State.mongo.disconnect();
};

start()
  .then(() => {
    Log.log('App', 'App started');
  })
  .catch((err) => {
    Log.error('App', (err as Error).message, (err as Error).stack);
    close();
  });
