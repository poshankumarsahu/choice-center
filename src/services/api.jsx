import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const API_BASE_URL =
  "https://us-central1-bk-studio-2f263.cloudfunctions.net/api";

export const submitForm = async (formData) => {
  try {
    // First submit to Firestore directly
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

    // Also submit to Cloud Function as backup
    const response = await fetch(`${API_BASE_URL}/submit-form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
      mode: "cors",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      message: "Form submitted successfully",
      data: {
        ...data,
        firestoreId: docRef.id,
      },
      status: response.status,
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: error.message || "Error submitting form. Please try again.",
      error: error.message,
    };
  }
};
