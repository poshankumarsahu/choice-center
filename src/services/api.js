export const submitForm = async (formData) => {
  try {
    const response = await fetch(
      "https://us-central1-bk-studio-2f263.cloudfunctions.net/api/submit-form",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
        mode: "cors",
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
