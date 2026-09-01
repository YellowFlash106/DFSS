const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const createSession = (token, userId) => prisma.session.create({
    data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    },
});

const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new AppError('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });
    await createSession(token, newUser.id);

    res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        }
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError('Invalid credentials', 400);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new AppError('Invalid credentials', 400);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    await createSession(token, user.id);

    res.status(201).json({
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        }
    });
});

const logoutUser = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('Authorization header missing', 401);
    }

    const normalizedHeader = authHeader.trim();
    const match = normalizedHeader.match(/^Bearer\s+(.+)$/i);
    const token = match ? match[1].trim() : normalizedHeader.trim();

    if (!token || token === "Bearer") {
        throw new AppError('Authorization header malformed', 401);
    }

    await prisma.session.deleteMany({
        where: { token },
    });

    res.status(200).json({ message: "User logged out successfully" });
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};