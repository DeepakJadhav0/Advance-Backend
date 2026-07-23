import { UserDto } from "../dto/user.dto.js";
import { user } from "../types/user.js";
 
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

export async function insertUser(email : string , hashPassword : string ):Promise<number>{

    const newUser : user =  {
        user_id : Date.now(),
        email : email.toLowerCase().trim(),
        password : hashPassword
    }

    users.push(newUser)

    return newUser.user_id

}