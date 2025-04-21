const multer = require("multer");
const bucket = require("../auth/firebaseConfig");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const upload = multer({ storage: multer.memoryStorage() }).array("images", 5); // Max 5 images

const uploadToFirebase = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const folderName = "landproject"; // Change this to your desired folder name

    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const fileName = `${folderName}/${uuidv4()}-${file.originalname}`; // Store inside the folder
        const fileRef = bucket.file(fileName);

        await fileRef.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
          predefinedAcl: "publicRead", // Make file public
        });

        return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      })
    );


    req.imageUrls = imageUrls; // Attach URLs to request object
    next();
  } catch (error) {

    console.error("Error uploading to Firebase:", error);
    return res.status(500).json({ message: "Error uploading files", error });
  }
};

module.exports = { upload, uploadToFirebase };
