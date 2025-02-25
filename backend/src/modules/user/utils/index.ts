import { compareValue, hashValue } from '../../../tools/passwords.js';

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return compareValue(password, hashedPassword);
};

export const hashPassword = async (password: string): Promise<string> => {
  return hashValue(password);
};
