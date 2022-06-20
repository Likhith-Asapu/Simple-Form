import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAHlxQr3Jx8-iPNT73grsMSizkV-CNVzSM",
  authDomain: "fir-demo-81966.firebaseapp.com",
  projectId: "fir-demo-81966",
  storageBucket: "fir-demo-81966.appspot.com",
  messagingSenderId: "379284740195",
  appId: "1:379284740195:web:531c68637b434940f1c056",
  measurementId: "G-NDB9DY5DXR"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getFirestore(app);
