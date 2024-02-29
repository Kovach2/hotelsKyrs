import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCgTEemP2JX40Kj5phSuPCGXt5jcnMDpPU",
  authDomain: "hotels-kyrsovaya.firebaseapp.com",
  databaseURL: "https://hotels-kyrsovaya-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hotels-kyrsovaya",
  storageBucket: "hotels-kyrsovaya.appspot.com",
  messagingSenderId: "133725414944",
  appId: "1:133725414944:web:6ced2eea9ba31fe2777e45",
  measurementId: "G-6SN84S4KXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export const storage = getStorage(app);


export default firestore