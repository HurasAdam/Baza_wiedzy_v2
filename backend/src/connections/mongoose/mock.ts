import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Log from 'simpl-loggar';

export default class Mock {
  async init(): Promise<void> {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());

    Log.log('Mongo', 'Started mock server');
  }
}
