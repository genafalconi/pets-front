import * as CryptoJS from "crypto-js";

export const encrypt = (message) => {
  return CryptoJS.AES.encrypt(message, process.env.REACT_APP_ENCRIPT_KEY).toString();
}

export const decrypt = (messageEncripted) => {
  const bytes = CryptoJS.AES.decrypt(messageEncripted, process.env.REACT_APP_ENCRIPT_KEY);
  return bytes.toString(CryptoJS.enc.Utf8)
}
