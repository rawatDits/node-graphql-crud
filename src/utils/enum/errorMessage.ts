enum ErrorMessageEnum {
	INVALID_REQUEST = "Invalid Request Created",
	RECORD_NOT_FOUND = "Record Not Found",
	INVALID_USER_ID = "Invalid User Id",
	INVALID_EMAIL_OR_CODE = "Invalid Email or Code!!",
	EMAIL_ALREADY_EXIST = "Email Already Exist",
	ROLE_ALREADY_EXIST = "Role Already Exist",
	INTERNAL_ERROR = "Internal server Error",
	REQUEST_PARAMS_ERROR = "Something Wrong In Req Params!",
	USER_NOT_EXIST = "User Not Exists!",
	UNAUTHORIZED = "Unauthorize user!",
	INVALID_TOKEN = "Invalid Token!",
	MISSING_TOKEN = "Missing Token!",
	USER_DELETE_FAILURE = "Failed to delete user",
	FAILED_TO_UPDATE_PROFILE = "Failed to update data",
	FAILED_TO_UPLOAD_FILE = "Failed to upload file",

}

export default ErrorMessageEnum;
