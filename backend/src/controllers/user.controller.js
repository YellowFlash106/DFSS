const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");


const getUser = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({ user });
});

module.exports = { getUser };