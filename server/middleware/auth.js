const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res
      .status(401)
      .json({ message: "Access denied : No Token Provided" });
  }

  try {
    const token = tokenHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied : Malformed Token" });
    }

    const verified = jwt.verify(token, process.env.MY_SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
