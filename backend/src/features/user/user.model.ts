import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";
import { compareValue, hashValue } from "@/utils/bcrypt";

type UserWithoutPassword = Omit<UserDocument, "password">;

export interface UserDocument extends mongoose.Document {
    _id: ObjectId;
    name: string;
    surname: string;
    email: string;
    isActive: boolean;
    profilePicture?: string | null;
    password: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
    comparePassword(val: string): Promise<boolean>;
    omitPassword(): UserWithoutPassword;
    favourites: mongoose.Types.ObjectId[];
    role: string;
}

const userSchema = new Schema<UserDocument>(
    {
        name: { type: String, required: true, trim: true },
        surname: { type: String, required: true, trim: true },
        email: { type: String, unique: true, required: true, trim: true, lowercase: true },
        password: { type: String, required: true },
        verified: { type: Boolean, required: true, default: false },
        profilePicture: { type: String, default: null },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date, default: null },
        favourites: [{ type: Schema.Types.ObjectId, ref: "Article" }],
        role: { type: String, required: true, default: "user" }, // Default role is "user"
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await hashValue(this.password);
    next();
});

userSchema.methods.comparePassword = async function (value: string) {
    return compareValue(value, this.password);
};

userSchema.methods.omitPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
