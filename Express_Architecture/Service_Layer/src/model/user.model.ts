import { UserDto } from "../dto/user.dto.js";
import { user } from "../types/user.js";
import bcrypt from "bcrypt"

const users : user[]  = []

export function getAllUsers(): UserDto[] {
  return users.map(({ user_id, email }) => ({
    user_id,
    email,
  }));
}

export function findUserByEmail(email : string):boolean{
    return users.some(u => u.email === email)
}

export async function createUser(email : string , password : string ):Promise<number>{

    const hashedPassword = await bcrypt.hash(password,10)

    const newUser : user =  {
        user_id : Date.now(),
        email : email.toLocaleLowerCase().trim(),
        password : hashedPassword
    }

    users.push(newUser)

    return newUser.user_id

}