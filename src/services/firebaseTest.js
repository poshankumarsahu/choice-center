import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const testFirebaseConnection = async () => {
  try {
    const testDoc = await addDoc(collection(db, "test"), {
      timestamp: new Date().toISOString(),
      test: true,
    });
    console.log("Test document created with ID:", testDoc.id);
    return true;
  } catch (error) {
    console.error("Firebase connection test failed:", error);
    return false;
  }
};
