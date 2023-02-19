import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import firebaseConfig from "./helpers/firebaseConfig";

const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp
export const firebaseAuth = getAuth(firebaseApp)
export const providerGoogle = new GoogleAuthProvider()
