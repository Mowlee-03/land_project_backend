const admin = require("firebase-admin");
const serviceAccount = require("./ServiceaccountKey.json"); // Update with your actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "realestate-8a68e.firebasestorage.app", // Your Firebase Storage bucket
});

const bucket = admin.storage().bucket();

module.exports = bucket;
