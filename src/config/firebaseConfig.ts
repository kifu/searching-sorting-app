// src/config/firebaseConfig.ts
import { Platform } from "react-native";
import { initializeApp } from "firebase/app";

// @ts-ignore
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBE5HaSCVt01usNRRD4kanIiyodTUoxtdU",
  authDomain: "searching-sorting-lab-847fa.firebaseapp.com",
  projectId: "searching-sorting-lab-847fa",
  storageBucket: "searching-sorting-lab-847fa.firebasestorage.app",
  messagingSenderId: "467231667781",
  appId: "1:467231667781:web:8a07736305c5e71561d52c",
};

const app = initializeApp(firebaseConfig);

let auth: Auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

export { auth };
export const db = getFirestore(app);
