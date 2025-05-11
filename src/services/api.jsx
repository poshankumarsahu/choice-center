const API_BASE_URL =
  "https://us-central1-bk-studio-2f263.cloudfunctions.net/api";

export const submitForm = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit-form`, {
      method: "POST",
      body: formData,
      mode: "cors",
      credentials: "include",
    });

    const data = await response.json();

    // Return data even if response is not ok, let component handle the error
    return {
      success: response.ok,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
