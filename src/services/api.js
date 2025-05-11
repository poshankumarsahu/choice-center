export const submitForm = async (formData) => {
  try {
    // Ensure formData is properly structured
    const payload = {
      name: formData.name || "",
      mobile: formData.mobile || "",
      serviceName: formData.serviceName || "",
      mainFileUrls: formData.mainFileUrls || "[]",
      otherFileUrls: formData.otherFileUrls || "[]",
    };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/submit-form`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Submission failed");
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: error.message || "An error occurred during submission",
    };
  }
};
