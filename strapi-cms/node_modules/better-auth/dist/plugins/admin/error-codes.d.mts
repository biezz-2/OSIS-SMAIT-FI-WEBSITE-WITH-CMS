//#region src/plugins/admin/error-codes.d.ts
declare const ADMIN_ERROR_CODES: {
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: import("@better-auth/core/utils/error-codes").RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
  FAILED_TO_CREATE_USER: import("@better-auth/core/utils/error-codes").RawError<"FAILED_TO_CREATE_USER">;
  USER_ALREADY_EXISTS: import("@better-auth/core/utils/error-codes").RawError<"USER_ALREADY_EXISTS">;
  YOU_CANNOT_BAN_YOURSELF: import("@better-auth/core/utils/error-codes").RawError<"YOU_CANNOT_BAN_YOURSELF">;
  YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE">;
  YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS">;
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS">;
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS">;
  YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_BAN_USERS">;
  YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS">;
  YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS">;
  YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS">;
  YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD">;
  BANNED_USER: import("@better-auth/core/utils/error-codes").RawError<"BANNED_USER">;
  YOU_ARE_NOT_ALLOWED_TO_GET_USER: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_USER">;
  NO_DATA_TO_UPDATE: import("@better-auth/core/utils/error-codes").RawError<"NO_DATA_TO_UPDATE">;
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS">;
  YOU_CANNOT_REMOVE_YOURSELF: import("@better-auth/core/utils/error-codes").RawError<"YOU_CANNOT_REMOVE_YOURSELF">;
  YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE">;
  YOU_CANNOT_IMPERSONATE_ADMINS: import("@better-auth/core/utils/error-codes").RawError<"YOU_CANNOT_IMPERSONATE_ADMINS">;
  INVALID_ROLE_TYPE: import("@better-auth/core/utils/error-codes").RawError<"INVALID_ROLE_TYPE">;
  YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL">;
  PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER: import("@better-auth/core/utils/error-codes").RawError<"PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER">;
};
//#endregion
export { ADMIN_ERROR_CODES };