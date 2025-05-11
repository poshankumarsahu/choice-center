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

// CORS middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bk-studio-2f263.web.app",
      "https://bk-studio-2f263.firebaseapp.com",
    ],
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Form submission endpoint with file upload
// Backend
app.post("/submit-form", upload.array("files"), async (req, res) => {
  try {
    const { name, mobile, serviceName } = req.body;
    const files = req.files; // Now an array of files

    // Create document in Firestore
    const docRef = await db.collection("submissions").add({
      name,
      mobile,
      serviceName,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Upload files if provided
    const fileUrls = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const fileName = `submissions/${docRef.id}/${file.originalname}`;
        const fileRef = storage.file(fileName);

        await fileRef.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
        });

        fileUrls.push(
          `https://storage.googleapis.com/${storage.name}/${fileName}`
        );
      }

      // Update document with file URLs
      await docRef.update({
        fileUrls: fileUrls,
      });
    }

    res.status(200).json({
      success: true,
      message: "Form submitted successfully",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting form",
      error: error.message,
    });
  }
});

// Export the Express app as a Cloud Function
const corsMiddleware = require("cors")({
  origin: true,
  credentials: true,
});

exports.api = functions.https.onRequest((req, res) => {
  return corsMiddleware(req, res, () => {
    if (req.path === "/submit-form" && req.method === "POST") {
      // Your existing form submission logic
      try {
        // Process form data
        // ...existing code...

        res.status(200).json({ success: true });
      } catch (error) {
        console.error("Form submission error:", error);
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    } else {
      res.status(404).send("Not Found");
    }
  });
});
