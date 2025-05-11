const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const multer = require("multer");

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage().bucket();
const app = express();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

// Update CORS configuration
app.use(
  cors({
    origin: true, // Allow all origins
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Update form submission endpoint
app.post("/submit-form", async (req, res) => {
  try {
    const { name, mobile, serviceName, mainFileUrls, otherFileUrls } = req.body;

    // Create document in Firestore
    const docRef = await admin
      .firestore()
      .collection("submissions")
      .add({
        name,
        mobile,
        serviceName,
        mainFileUrls: JSON.parse(mainFileUrls || "[]"),
        otherFileUrls: JSON.parse(otherFileUrls || "[]"),
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
      message: error.message,
    });
  }
});

exports.api = functions.https.onRequest(app);
