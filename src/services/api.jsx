const API_BASE_URL =
  "https://us-central1-bk-studio-2f263.cloudfunctions.net/api";

export const submitForm = async (formData) => {
  try {
    const response = await fetch(
      "https://us-central1-bk-studio-2f263.cloudfunctions.net/api/submit-form",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        mode: "cors",
      }
    );

    const data = await response.json();
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
