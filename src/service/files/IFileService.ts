
// import { Upload } from "graphql-upload-ts";
import { IResponse } from "../../utils/interface/common";
import fs from "fs"


interface Upload {
    file: {
      createReadStream: () => fs.ReadStream;
      filename: string;
      mimetype: string;
      encoding: string;
    };
  }
export interface IFileServiceAPI {
    uploadSingleFile(request: IUploadFileRequest): Promise<IUploadFileResponse>;
    uploadMultipleFiles(request: IUploadMultipleFileRequest): Promise<IUploadFileResponse>;
}


/********************************************************************************
 *  Upload file
 ********************************************************************************/
export interface IUploadFileRequest {
    filename:string,
    mimetype:string,
    createReadStream:any
}
// export interface IUploadMultipleFileRequest {
//     file : any

// }
export interface IUploadMultipleFileRequest{
    files: {
        filename:string,
        mimetype:string,
        createReadStream:any
    }[]

}

export interface IUploadFileResponse extends IResponse {
    file?:any

}




