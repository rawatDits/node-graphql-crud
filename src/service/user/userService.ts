import Joi from "joi";
import UserStore from "./userStore";
import IUSER from "../../utils/interface/user/IUser";
import STATUS_CODES from "../../utils/enum/statusCodes";
import ErrorMessageEnum from "../../utils/enum/errorMessage";
import * as IUserService from "./IUserService";
import { IAppServiceProxy } from "../appServiceProxy";
import { toError } from "../../utils/interface/common";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema, updateSchema } from "../../utils/common/joiSchema/user/userSchema";
import { JoiError } from "../../helper/joiErrorHandler";
import { JoiValidate } from "../../helper/JoiValidate";
import dotenv from 'dotenv';

dotenv.config();

export default class UserService implements IUserService.IUserServiceAPI {
    private userStore = new UserStore();
    private proxy: IAppServiceProxy;
    constructor(proxy: IAppServiceProxy) {
        this.proxy = proxy;
    }
    private generateJWT = (user: IUSER): string => {
        const payLoad = {
            _id: user._id,
            email: user.email,
            role: user.role,
        };
        return jwt.sign(payLoad, process.env.JWT_SECRET);
    };

    /**************************************************************
    * register
    **************************************************************/
    public register = async (req: IUserService.IRegisterUserRequest):Promise<IUserService.IRegisterUserResponse> => {

        /**************response object*****************/
        let response : IUserService.IRegisterUserResponse = {
            status : STATUS_CODES.UNKNOWN_CODE
        }

        /****************Joi validation*****************/
        const {error, value} = JoiValidate(registerSchema,req )
        if(error){
            let paramsError = JoiError(error);
            response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
            response.error = toError(paramsError.error.details[0].message);
            return response;
        }

        /**************Logical + Database *****************/
        const { firstname, lastname, email, password, role } = value;

        let existingUser : IUSER;
        try {
            existingUser = await this.userStore.getByEmail(email);
            //Error if email id is already exist
            if (existingUser && existingUser?.email) {
                response.status = STATUS_CODES.BAD_REQUEST
                response.error = toError(ErrorMessageEnum.EMAIL_ALREADY_EXIST)
                return response;
            }
        } catch (e) {
            console.error(e);
            response.status = STATUS_CODES.INTERNAL_SERVER_ERROR
            response.error = toError(e.message)
            return response
        }
        let user: IUSER;
        try {
            const hashPassword = await bcrypt.hash(password, 10);
            const attributes: IUSER = {
                firstname,
                lastname,
                email: email.toLowerCase(),
                password: hashPassword,
                role
            };
            
            user = await this.userStore.createUser(attributes);
            if(!user){
                response.status = STATUS_CODES.INTERNAL_SERVER_ERROR
                response.error = toError(ErrorMessageEnum.EMAIL_ALREADY_EXIST)
            }

        } catch (e) {
            console.error(e);
            response.status = STATUS_CODES.INTERNAL_SERVER_ERROR
            response.error = toError(e.message)
            return response;
        }

        /**********Generate JWT Token******************/
        const token = this.generateJWT(user);
        response.status = STATUS_CODES.OK;
        response.user = user
        response.token = token
         console.log("response",response)
        return response;
       
    };


    /**************************************************************
    * Login
    **************************************************************/
    public login  = async (req:IUserService.ILoginUserRequest):Promise<IUserService.ILoginUserResponse> =>{
   
        /**************response object*****************/
        let response : IUserService.ILoginUserResponse = {
            status:STATUS_CODES.UNKNOWN_CODE
        }

        /**************Joi Validatiaon**************/
        const {error , value} = JoiValidate(loginSchema,req);
        if(error){
            let paramsError = JoiError(error);
            response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
            response.error = toError(paramsError.error.details[0].message);
            return response;
        }
        
        let {email , password } = value;
        /********************Login And DB****************/
        //check if email exist
        let emailExist : IUSER;
        try{
           emailExist = await this.userStore.getByEmail(email);
           if(!emailExist){
               response.status = STATUS_CODES.BAD_REQUEST,
               response.error = toError(ErrorMessageEnum.INVALID_EMAIL_OR_CODE)
               return response
           }
           //check if password matches
           const isValidPassword = await bcrypt.compare(password, emailExist?.password);
           if(!isValidPassword || password==""){
               response.status = STATUS_CODES.BAD_REQUEST,
               response.error = toError(ErrorMessageEnum.INVALID_EMAIL_OR_CODE)
               return response
           }
        }catch(err){
            response.status = STATUS_CODES.BAD_REQUEST,
            response.error = toError(err.message)
            return response
        }

        response.status = STATUS_CODES.OK,
        response.user = emailExist,
        response.token = this.generateJWT(emailExist)
        return response
    }


    /**************************************************************
    * Get user profile
    *************************************************************/
    public getUserProfile = async (req: IUserService.IGetProfileUserRequest):Promise<IUserService.IGetProfileUserResponse> => {
        const { id } = req;
        const response: IUserService.IGetProfileUserResponse = {
            status: STATUS_CODES.UNKNOWN_CODE,
        };
        let user: IUSER;
        try {
            user = await this.userStore.getById(id);
            //if user's id is incorrect
            if (!user) {
                response.status = STATUS_CODES.BAD_REQUEST;
                response.error = toError(ErrorMessageEnum.INVALID_USER_ID);
                return response
            }
        }
        catch (e) {
            console.error(e);
            response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
            response.error = toError(e.message)
            return response;
        }
        response.status = STATUS_CODES.OK;
        response.user = user
         return response;
    };

    
    /************************************************************
    * Update user detail
    *************************************************************/
    public updateUser = async (req: IUserService.IUpdateUserRequest):Promise<IUserService.IUpdateUserResponse> => {
     
        const response: IUserService.IUpdateUserResponse = {
            status: STATUS_CODES.UNKNOWN_CODE,
        };

        /**************Joi Validation***********/
        let {error, value} =  JoiValidate(updateSchema, req)
        if(error){
            let paramsError = JoiError(error);
            response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
            response.error = toError(paramsError.error.details[0].message);
            return response;
        }
        let user: IUSER;
        try {
             console.log("value", value)
            user = await this.userStore.updateById(value);
            //if user's id is incorrect
            if (!user) {
                response.status = STATUS_CODES.BAD_REQUEST;
                response.error = toError(ErrorMessageEnum.FAILED_TO_UPDATE_PROFILE);
                return response
            }
        }
        catch (e) {
            console.error(e);
            response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
            response.error = toError(e.message)
            return response;
        }
        response.status = STATUS_CODES.OK;
        response.user = user
         return response;
    };



}
