import mongoose, { model } from "mongoose";
import userInterface from "../../utils/interface/store/user";
import { nanoid } from "nanoid";
import Roles from "../../utils/enum/roles";
const schema = mongoose.Schema;
const userSchema = new schema<userInterface>({
    _id: {
        type: String,
        required: false,
        default: () => nanoid(),
    },
    firstname: {
        type: String,
        required: true,
        default: null
    },
    lastname: {
        type: String,
        required: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
        default: null
    },
    role: {
        type: String,
        enum: Roles,
    },
    isActive: {
        type: Number,
        default:0
    },
    isVerified: {
        type: Number,
        default:0
    },
    verifyEmailCode: {
        type: String,
        default:""
    },
    isSubscribed: {
        type: Number,
        default:0
    },
    image: {
        type: String,
        default: null
    }
});

export const UserModel = model("users", userSchema);
