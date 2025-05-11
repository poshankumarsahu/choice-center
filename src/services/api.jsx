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

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    // Ensure we have a valid response
    if (!data || (!data.success && !data.id)) {
      throw new Error("Invalid response from server");
    }

    return data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw new Error(`Form submission failed: ${error.message}`);
  }
};
