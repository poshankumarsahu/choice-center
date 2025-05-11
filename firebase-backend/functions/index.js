const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin
admin.initializeApp();

const app = express();

// Update CORS configuration
app.use(
  cors({
    origin: true,
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Update form submission endpoint with v2 functions
app.post("/submit-form", async (req, res) => {
  try {
    const { name, mobile, serviceName, mainFileUrls, otherFileUrls } = req.body;

    // Validate required fields
    if (!name || !mobile || !serviceName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Parse file URLs with error handling
    let parsedMainUrls = [];
    let parsedOtherUrls = [];
    try {
      parsedMainUrls = JSON.parse(mainFileUrls || "[]");
      parsedOtherUrls = JSON.parse(otherFileUrls || "[]");
    } catch (e) {
      console.error("Error parsing URLs:", e);
      return res.status(400).json({
        success: false,
        message: "Invalid file URL format",
      });
    }

    // Create document in Firestore
    const docRef = await admin.firestore().collection("submissions").add({
      name,
      mobile,
      serviceName,
      mainFileUrls: parsedMainUrls,
      otherFileUrls: parsedOtherUrls,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: "Form submitted successfully",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during form submission",
    });
  }
});

// Export the API as a v2 function with configuration
exports.api = onRequest(
  {
    cors: true,
    maxInstances: 10,
  },
  app
);
