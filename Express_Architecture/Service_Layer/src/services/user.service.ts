import { getAllUsers } from "../model/user.model.js";
import { user } from "../types/user.js";

export function getUsers(){
    const users : user[] = getAllUsers()
}