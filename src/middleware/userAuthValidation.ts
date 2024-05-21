
import STATUS_CODES from "../utils/enum/statusCodes";
import ErrorMessageEnum from "../utils/enum/errorMessage";
import responseMessage from "../utils/enum/responseMessage";
import { IApiResponse, toError } from "../utils/interface/common";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const userAuthValidation = async (contextValue) =>{
    console.log("contextValue", contextValue)
    const token = contextValue.token; // Assuming token is passed in the context
    if (!token) {
        throw new Error('Authentication token is missing!');
    }

    console.log("token", token)
    try {
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        contextValue.user = decoded;
    } catch (error) {
        throw new Error('Authentication failed! Invalid token.');
    }
}

