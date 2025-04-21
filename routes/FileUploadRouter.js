const express = require("express");
const { upload, uploadToFirebase } = require("../Middleware/upload");
const { authenticate } = require("../Middleware/middlware");

const router = express.Router();

router.post("/uploads", authenticate, upload, uploadToFirebase, (req, res) => {
  res.json({
    message: "Files uploaded successfully",
    imageUrls: req.imageUrls,
  });
});

module.exports = router

