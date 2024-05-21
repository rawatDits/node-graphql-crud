
import IUSER from "../../utils/interface/user/IUser";
import IUPDATEUSER from "../../utils/interface/user/IUpdateUser";
import { IResponse } from "../../utils/interface/common";

export interface IUserServiceAPI {
    register(request: IRegisterUserRequest): Promise<IRegisterUserResponse>;
    login(request: ILoginUserRequest): Promise<ILoginUserResponse>;
    getUserProfile(request: IGetProfileUserRequest): Promise <IGetProfileUserResponse>;
    updateUser(request: IUpdateUserRequest):Promise<IUpdateUserResponse>;
}


/********************************************************************************
 *  Register user
 ********************************************************************************/
export interface IRegisterUserRequest {
    firstname: string;
    lastname:string,
    email:string, 
    password:string,
    role:string 
}

export interface IRegisterUserResponse extends IResponse {
   user?:any, 
   token?:string

}



/********************************************************************************
 * Login
 ********************************************************************************/
export interface ILoginUserRequest{
    email: string;
    password: string;
}
export interface ILoginUserResponse extends IResponse {
    user?: IUSER;
    token?: string
}


/********************************************************************************
 * Get user profile
 ********************************************************************************/
export interface IGetProfileUserRequest {
    id: string,
}
export interface IGetProfileUserResponse extends IResponse {
    user?: IUSER;
}


/********************************************************************************
 *  update user
 ********************************************************************************/

export interface IUpdateUserRequest {
    id:String,
    firstname?: string;
    lastname?: string;
}

export interface IUpdateUserResponse extends IResponse {
user?: IUPDATEUSER;
}

