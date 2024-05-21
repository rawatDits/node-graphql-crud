/* eslint-disable no-useless-catch */
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../../utils/enum/statusCodes";
import proxy from "../../service/appServiceProxy";
import * as IUserService from "../../service/user/IUserService";
import * as IFileService from "../../service/files/IFileService";
import {userAuthValidation} from "../../middleware/userAuthValidation"


export default {
  Query: {

    /************************************************************
     Get user profile
    /***********************************************************/
    async getUserProfile(parent, args, contextValue) {
      let response: IUserService.IGetProfileUserResponse;
      try{
        await userAuthValidation(contextValue);
        const {_id}= contextValue.user;

        const request: IUserService.IGetProfileUserRequest = {id:_id}

        response = await proxy.user.getUserProfile(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
          );
        }
    
        } catch (e) {
            throw e;
        }

        return response.user;
    }
  },
  Mutation: {
    /************************************************************
     Register user
    /***********************************************************/
    async register(parent, args) {

    //Arguemnts 
    const  {
      user:{firstname, lastname, email, password,role}
    } = args


    //Request
    const request : IUserService.IRegisterUserRequest = {
      firstname, 
      lastname,
      email,
      password,
      role
     }

    // Response
    let response: IUserService.IRegisterUserResponse;


    // GQL APi Request
      try {
        response = await proxy.user.register(request);
        console.log("response in resolver", response)
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
          );
        }
   
      } catch (e) {
          throw e;
      }

      return response;
    },


    /************************************************************
     Login user
    /***********************************************************/
    login  : async(parent, args) => {
      const {
        user:{email , password}
      } = args

      console.log("email", email , password)

      const requset : IUserService.ILoginUserRequest = {email , password}

      let response : IUserService.ILoginUserResponse

      try{
           response = await proxy.user.login(requset)
           if(response.status!=STATUS_CODES.OK){
            throw new ApolloError(
              response.error.message,
            );
           }
      }catch(err){
          throw err
      }
      return response;

    },



    /************************************************************
     Update  user data
    /***********************************************************/
    updateUser : async(parent, args, contextValue) =>  {
      const {user:{firstname, lastname}} = args;
      let response: IUserService.IUpdateUserResponse;
      try{
        await userAuthValidation(contextValue);
        const {_id} = contextValue.user;

        const request: IUserService.IUpdateUserRequest = {
          id:_id,
          firstname,
          lastname,
        }

        response = await proxy.user.updateUser(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
          );
        }
    
        } catch (e) {
            throw e;
        }

        return response.user;
    },

    /***************************************************************
    File Single Upload
    ****************************************************************/
    uploadSingleFile: async (parent, { file }) => {
   
      const { file :{createReadStream, filename, mimetype} } = await file;

      let response: IFileService.IUploadFileResponse;

      const request  : IFileService.IUploadFileRequest = {createReadStream, filename, mimetype} 
      try {
        response = await proxy.file.uploadSingleFile(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
          );
        }
      }catch (e) {
            throw e;
      }
      return response.file;      
    },

    /***************************************************************
    File Multiple Upload
    ****************************************************************/
    uploadMultipleFiles: async (parent, { files }) => {
      let response: IFileService.IUploadFileResponse;
      
      let fileArray = []
      await Promise.all(files.map(async (file) => {
         fileArray.push(await file.file)
      }));

      const request  : IFileService.IUploadMultipleFileRequest = {files: fileArray};
      try {
        response = await proxy.file.uploadMultipleFiles(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
          );
        }
      }catch (e) {
            throw e;
      }
      
     return response.file
    },
  },
};
