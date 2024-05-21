import Joi from "joi";
// import UserStore from "./fileStore";
import STATUS_CODES from "../../utils/enum/statusCodes";
import ErrorMessageEnum from "../../utils/enum/errorMessage";
import * as IFileService from "./IFileService";
import { IAppServiceProxy } from "../appServiceProxy";
import { toError } from "../../utils/interface/common";
import  fs , { createWriteStream } from "fs";

import dotenv from 'dotenv';

dotenv.config();

export default class FileService implements IFileService.IFileServiceAPI {
    private proxy: IAppServiceProxy;
    constructor(proxy: IAppServiceProxy) {
        this.proxy = proxy;
    }
    

    public uploadSingleFile = async (req: IFileService.IUploadFileRequest):Promise<IFileService.IUploadFileResponse> => {
        let {filename , createReadStream, mimetype} = req;
        const response: IFileService.IUploadFileResponse = {
            status: STATUS_CODES.UNKNOWN_CODE,
        };
  

        let fileData : any;
        try {
            const stream = createReadStream()

            const id = "3";
            const path = `uploads/${id}-${filename}`;
            fileData = await new Promise((resolve, reject) =>
              stream
                .pipe(createWriteStream(path))
                .on("finish", () => resolve({ path, filename, mimetype }))
                .on("error", reject)
            );
            if(!fileData){
                response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
                response.error = toError(ErrorMessageEnum.FAILED_TO_UPLOAD_FILE)
                return response;
            }
        }
        catch (e) {
            response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
            response.error = toError(e.message)
            return response;
        }
        response.status = STATUS_CODES.OK;
        response.file = fileData
        return response;
    };


    public uploadMultipleFiles = async (req: IFileService.IUploadMultipleFileRequest):Promise<IFileService.IUploadFileResponse> => {
        const { files } = req;
        const response: IFileService.IUploadFileResponse = {
            status: STATUS_CODES.UNKNOWN_CODE,
        };
        
        let fileData : any;
        try {
            fileData = await Promise.all(files.map(async (file) => {
                const { createReadStream, filename, mimetype } = file;
                const stream = createReadStream();
                const filePath = `uploads/${filename}`
                const out = fs.createWriteStream(filePath);
                stream.pipe(out);
                    await new Promise((resolve, reject) => {
                    out.on('finish', resolve);
                    out.on('error', reject);
                    });
                return { filename, mimetype, path: filePath };
              }));
            if(!fileData){
                response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
                response.error = toError(ErrorMessageEnum.FAILED_TO_UPLOAD_FILE)
                return response;
            }
             console.log("fileData", fileData)
        }
        catch (e) {
            response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
            response.error = toError(e.message)
            return response;
        }
        response.status = STATUS_CODES.OK;
        response.file = fileData
        return response;
    };



}
