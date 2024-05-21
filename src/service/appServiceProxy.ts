import * as IUserService from "./user/IUserService";
import UserService from "./user/userService";
import * as IFileService from "./files/IFileService";
import FileService from "./files/fileService";


export interface IAppServiceProxy {
  user: IUserService.IUserServiceAPI;
  file: IFileService.IFileServiceAPI;
}

class AppServiceProxy implements IAppServiceProxy {
  public user: IUserService.IUserServiceAPI;
  public file: IFileService.IFileServiceAPI;

  constructor() {
    this.user = new UserService(this);
    this.file = new FileService(this);
  }
}

export default new AppServiceProxy();
