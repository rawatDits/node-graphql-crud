import IUSER from "../../utils/interface/user/IUser";
import { UserModel } from "../../db/model/users";
import { IUpdateUserRequest } from "./IUserService";
import updateUser from "src/utils/interface/user/IUpdateUser";

export default class UserStore {
	public static OPERATION_UNSUCCESSFUL = class extends Error {
		constructor() {
			super("An error occured while processing the request.");
		}
	};

	/**
	 * creating new user and saving in Database
	 */
	public async createUser(userInput: IUSER): Promise<IUSER> {
		try {
			let savedUser: any = await UserModel.create(userInput);
			return savedUser;
		} catch (error) {
			return error;
		}
	}

	/**
	 *Get by email
	 */
	public async getByEmail(email: string): Promise<IUSER> {
		try {
			let user: any = (await UserModel.findOne({ email } , ''));
			return user;
		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}

	/**
	 *Get by id
	 */
	public async getById(id: string): Promise<IUSER> {
		try {
			let user: any = await UserModel.findOne({ _id: id });
			return user;
		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}
	/**
	 *Updatee user
	 */
	public async updateById(data:IUpdateUserRequest): Promise<IUSER> {
		try {
			const {id, firstname, lastname} = data;
			let updateObj: updateUser  = {}
			if(firstname) updateObj.firstname = firstname;
			if(lastname) updateObj.lastname = lastname;

			let user: any = await UserModel.findOneAndUpdate({ _id: id }, updateObj, {new:true});
			return user;
			
		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}



	public async getAll(): Promise<IUSER[]> {
		try {
			let users: any = await UserModel.find();
			return users
		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}

	public async deleteById(id:string): Promise<Boolean> {
		try {
			let users: any = await UserModel.deleteOne({_id:id});
			if(users.deletedCount)return true
			else return false;
		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}
}
