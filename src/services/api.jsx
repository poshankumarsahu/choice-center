import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

export const submitForm = async (formData) => {
  try {
    // Validate input
    if (!formData.name || !formData.mobile) {
      throw new Error("Name and mobile are required");
    }

    // Submit to Firestore
    const submissionsRef = collection(db, "submissions");
    const firestoreData = {
      name: formData.name,
      mobile: formData.mobile,
      serviceName: formData.serviceName || "",
      mainFileUrls: formData.mainFileUrls || [],
      otherFileUrls: formData.otherFileUrls || [],
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    const docRef = await addDoc(submissionsRef, firestoreData);
    console.log("Document written with ID: ", docRef.id);

    return {
      success: true,
      message: "Form submitted successfully",
      data: {
        id: docRef.id,
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
