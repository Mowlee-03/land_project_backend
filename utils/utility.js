const jwt = require('jsonwebtoken');
const bcrypt=require("bcryptjs")

const generateToken = (payload) => {
  console.log(payload)
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2d'
  });
};

const verifyToken = (token) => {
  try {
      return jwt.verify(token, process.env.JWT_SECRET); // Use a secure secret
  } catch (err) {
      // Handle specific token errors
      if (err.name === 'TokenExpiredError') {
          return { error: 'Token has expired' };
      } else {
          return { error: 'Invalid token' };
      }
  }
};

const setAuthTokenCookie = (res, token) => {
  res.cookie('authToken', token, {
      httpOnly: false, // Prevent access from JavaScript (mitigates XSS attacks)
      secure: process.env.NODE_ENV==="production",
      sameSite: 'None', // Protect against CSRF
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
  });
};

const hashPassword = (password) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password: ' + error.message);
  }
};

const verifyPasword=(password,comparepassword)=>{
  try {
    const verify=bcrypt.compare(password,comparepassword)
    return verify;
  } catch (error) {
    throw new Error("invalid password")
  }
}

module.exports = {
  generateToken,
  verifyToken,
  setAuthTokenCookie,
  hashPassword,
  verifyPasword
};
