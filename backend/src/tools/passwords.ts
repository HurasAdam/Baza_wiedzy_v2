import bcrypt from 'bcrypt';

export const hashValue = async (val: string, saltRounds?: number): Promise<string> => {
  return bcrypt.hash(val, saltRounds ?? 10);
};

export const compareValue = async (value: string, hashedValue: string): Promise<boolean> => {
  return bcrypt.compare(value, hashedValue).catch(() => false);
};
