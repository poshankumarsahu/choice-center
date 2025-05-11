const API_BASE_URL =
  "https://us-central1-bk-studio-2f263.cloudfunctions.net/api";

export const submitForm = async (formData) => {
  try {
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

    // Check both response.ok and data.success
    if (!response.ok) {
      throw new Error(data.message || "Network response was not ok");
    }

    return {
      success: data.success,
      message: data.message,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: error.message || "Error uploading files. Please try again.",
      error: error.message,
    };
  }
};
