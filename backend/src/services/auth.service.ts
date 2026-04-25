import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { MongoServerError } from "mongodb";
import { env } from "../config/env";
import { getDb } from "../config/database";
import { AppError } from "../errors/app-error";
import { PublicUser, UserDocument, UserRole } from "../types/user.types";

const SALT_ROUNDS = 10;

type AuthResult = {
  token: string;
  user: PublicUser;
};

export type RegisterUserInput = {
  userName: string;
  email: string;
  password: string;
  Role: UserRole;
};

export type LoginUserInput = {
  email: string;
  password: string;
};

const usersCollection = () => getDb().collection<UserDocument>("users");

const sanitizeUser = (user: UserDocument): PublicUser => {
  const { password: _password, ...publicUser } = user;
  return publicUser;
};

const createToken = (user: UserDocument): string => {
  const expiresIn = env.JWT_EXPIRES_IN as SignOptions["expiresIn"];

  return jwt.sign(
    {
      userID: user.userID,
      email: user.email,
      role: user.Role,
    },
    env.JWT_SECRET,
    { expiresIn }
  );
};

const mapDuplicateKeyError = (error: MongoServerError): AppError => {
  const key = Object.keys(error.keyPattern ?? {})[0];

  if (key === "email") {
    return new AppError("Email already exists", 409);
  }

  if (key === "userID") {
    return new AppError("Generated userID already exists. Please retry", 409);
  }

  return new AppError("Duplicate user data", 409);
};

export const registerUser = async (payload: RegisterUserInput): Promise<AuthResult> => {
  const normalizedEmail = payload.email.toLowerCase();
  const users = usersCollection();

  const existingUser = await users.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const now = new Date();

  const newUser: UserDocument = {
    userID: randomUUID(),
    userName: payload.userName,
    email: normalizedEmail,
    password: hashedPassword,
    Role: payload.Role,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await users.insertOne(newUser);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw mapDuplicateKeyError(error);
    }

    throw error;
  }

  return {
    token: createToken(newUser),
    user: sanitizeUser(newUser),
  };
};

export const loginUser = async (payload: LoginUserInput): Promise<AuthResult> => {
  const normalizedEmail = payload.email.toLowerCase();
  const users = usersCollection();

  const user = await users.findOne({ email: normalizedEmail });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    token: createToken(user),
    user: sanitizeUser(user),
  };
};
