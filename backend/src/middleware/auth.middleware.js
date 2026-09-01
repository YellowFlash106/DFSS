const prisma = require("../utils/prisma");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error("Authorization header missing");
  }

  const normalizedHeader = authHeader.trim();
  const match = normalizedHeader.match(/^Bearer\s+(.+)$/i);
  const token = match ? match[1].trim() : normalizedHeader.trim();

  if (!token || token === "Bearer") {
    throw new Error("Authorization header malformed");
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  const session = await prisma.session.findUnique({
    where: { token },
  });

  if (!session || session.expiresAt <= new Date()) {
    throw new Error("Session expired");
  }

  req.user = {
    userId: decoded.userId,
    role: decoded.role,
  };

  next();
});

module.exports = authenticate;