const enum AppErrorCode {
    InvalidAccessToken = "InvalidAccessToken",
    UserNotFound = "UserNotFound",
    Forbidden = "Forbidden",
    InvalidRole = "InvalidRole", // Optional, if you want to differentiate role errors
}

export default AppErrorCode;
