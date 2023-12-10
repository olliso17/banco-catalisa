export const stringNotNullAndBlankSpace = /^(?!\s*$).+/;
export const isEmail: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const isCpf: RegExp = /^[0-9]{11}$/;
export const isValidPassword =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/;

export const isUrl: RegExp =
  /^(?=.{1,2083}$)(?:(?:https?|ftp):\/\/)?((?:xn--)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\.){1,}(?:[a-zA-Z]{2,})(?:\/[^\/\r\n]*)*$/i;

export const isFile: RegExp = /(?:\.([^.]+))?$/;

export const extensionImageExist = /^image\/(jpeg|png|jpg|bmp)$/;
export const stringSpecialCaracters =
  /^(?![!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~])[\w!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/;

export const atLeastOneUppercaseLetter = /^(?=.*[A-Z]).+$/;

export const atLeastOneSpecialCharacter =
  /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~])/;

export const isNumber = /^\d+$/;

export const atLeastOneNumber = /.*[0-9].*/;