import mongoose from 'mongoose';
import { MONGO_URI } from '../constants/index.js';

export default async (): Promise<void> => {
  await mongoose.connect(MONGO_URI);
};
