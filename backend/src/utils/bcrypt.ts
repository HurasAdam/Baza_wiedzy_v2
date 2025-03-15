import bcrypt,{hash,compare} from "bcrypt";

export const hashValue = async (val: string, saltRounds?: number) =>{
   return bcrypt.hash(val, saltRounds || 10);
}
  

export const compareValue = async(value:string, hashedValue:string)=>{
return bcrypt.compare(value, hashedValue).catch(()=> false);
}