import { createUserDTO } from "../dto/user.dto.js";
import {
  findUserByEmail,
  getAllUsers,
  insertUser,
} from "../model/user.model.js";
import { user } from "../types/user.js";
import { AppError } from "../utils/AppError.js";
import bcrypt from "bcrypt";


export function getUsers() {
  const users: user[] = getAllUsers();
  return users
}

export async function createUser({ email, password }: createUserDTO) {
  try {

    if (!email || !password) {
      throw new AppError(400, "Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailExists = findUserByEmail(normalizedEmail);

    if (emailExists) {
      throw new AppError(400, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user_id = await insertUser(email, hashedPassword);

    return user_id;

  } catch (error) {

    if (error instanceof AppError) throw error;

    throw new AppError(500, "Internal Server Error");
    
  }
}
