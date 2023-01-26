import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBp-d5yPwwmrBHMztNTngcfTsuwuwCmv-0",
  authDomain: "petszonearg.firebaseapp.com",
  databaseURL: "https://petszonearg-default-rtdb.firebaseio.com",
  projectId: "petszonearg",
  storageBucket: "petszonearg.appspot.com",
  messagingSenderId: "1084158049080",
  appId: "1:1084158049080:web:9bf895c432b34a743d5fcd",
  measurementId: "G-7HB8BD79ZF"
};
const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp
export const firebaseAuth = getAuth(firebaseApp)
export const providerGoogle = new GoogleAuthProvider()
