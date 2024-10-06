import { NOT_FOUND, OK } from "../constants/http";
import UserModel from "../models/User.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    appAssert(user, NOT_FOUND, "User not found");
    return res.status(OK).json(user.omitPassword());
  });



  export const getUsersHandler = catchErrors(async(req,res)=>{
    const users = await UserModel.find({}).select(["-password","-email","-verified","-createdAt","-updatedAt","-favourites"])
    
    return res.status(OK).json(users);
  })