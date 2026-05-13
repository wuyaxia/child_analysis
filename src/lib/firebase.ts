import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../config/firebase.config";

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 导出服务
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
