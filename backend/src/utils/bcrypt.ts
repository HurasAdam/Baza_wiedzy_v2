import { compareSync, hashSync } from "bcrypt";

export const hashValue = (val: string, saltRounds: number = 10) => {
    return hashSync(val, saltRounds);
};

export const compareValue = (value: string, hashedValue: string) => {
    return compareSync(value, hashedValue);
};
