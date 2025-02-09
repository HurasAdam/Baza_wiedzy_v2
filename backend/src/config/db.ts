import mongoose from 'mongoose';
import getConfig from '../constants/index.js';

export default async (): Promise<void> => {
  await mongoose.connect(getConfig().MONGO_URI);
};
