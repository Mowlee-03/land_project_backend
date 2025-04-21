const {verifyToken}=require("../utils/utility")

const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.authToken; // Retrieve token from cookies
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided." });
        }
        const decoded = verifyToken(token) // Verify the token
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token." });
          }
        req.user = decoded; // Attach decoded payload to the request object
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
};


module.exports={
    authenticate
}