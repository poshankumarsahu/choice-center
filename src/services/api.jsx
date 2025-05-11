import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

export const submitForm = async (formData) => {
  try {
    // Submit to Firestore
    const submissionsRef = collection(db, "submissions");
    const firestoreData = {
      name: formData.name,
      mobile: formData.mobile,
      serviceName: formData.serviceName,
      mainFileUrls: JSON.parse(formData.mainFileUrls || "[]"),
      otherFileUrls: JSON.parse(formData.otherFileUrls || "[]"),
      timestamp: new Date(),
    };

    const docRef = await addDoc(submissionsRef, firestoreData);

    return {
      success: true,
      message: "Form submitted successfully",
      data: {
        firestoreId: docRef.id,
        ...firestoreData,
      },
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: error.message || "Error submitting form",
      error: error.toString(),
    };
  }
};
