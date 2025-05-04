import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";
import { compareValue, hashValue } from "../../utils/bcrypt";

export type UserWithoutPassword = Omit<UserDocument, "password">;

export interface UserDocument extends mongoose.Document {
    _id: ObjectId;
    name: string;
    surname: string;
    email: string;
    isActive: boolean;
    profilePicture?: string | null;
    password: string;
    mustChangePassword: boolean;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
    favourites: mongoose.Types.ObjectId[];
    role: ObjectId;

    comparePassword(val: string): boolean;
    omitPassword(): UserWithoutPassword;
}

const userSchema = new Schema<UserDocument>(
    {
        name: { type: String, required: true, trim: true },
        surname: { type: String, required: true, trim: true },
        email: { type: String, unique: true, required: true, trim: true, lowercase: true },
        password: { type: String, required: true },
        mustChangePassword: { type: Boolean, default: true },
        verified: { type: Boolean, required: true, default: false },
        profilePicture: { type: String, default: null },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date, default: null },
        favourites: [{ type: Schema.Types.ObjectId, ref: "Article" }],
        role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = hashValue(this.password);
    next();
});

userSchema.methods.comparePassword = function (value: string) {
    return compareValue(value, this.password);
};

userSchema.methods.omitPassword = function () {
    const { password, ...user } = this.toObject();
    return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
