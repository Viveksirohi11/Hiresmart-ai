import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function makeToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      return res.status(400).json({ message: "Enter a valid name/email and a password of at least 8 characters." });
    }
    if (await User.exists({ email })) return res.status(409).json({ message: "An account with this email already exists." });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: makeToken(user.id), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password." });
    res.json({ token: makeToken(user.id), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
}
