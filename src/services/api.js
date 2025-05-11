export const submitForm = async (formData) => {
  try {
    const response = await fetch(
      "https://us-central1-bk-studio-2f263.cloudfunctions.net/api/submit-form",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          // Remove Content-Type header as it's automatically set with FormData
        },
        credentials: "include", // Include credentials
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Submit form error:", error);
    throw error;
  }
};
