import { Response , Request } from "express"
import { findUserByEmail  } from "../model/user.model.js"
import { createUserDTO } from "../dto/user.dto.js"
import { user } from "../types/user.js"
import { createUser, getUsers } from "../services/user.service.js"
import { AppError } from "../utils/AppError.js"


export async function userList(req : Request , res : Response) {

    const users = getUsers()

    res.status(200).json({
        status : true,
        data : users
    })
}

export async function addUser(req : Request , res : Response) {
   const {email , password} = req.body as createUserDTO

    try {
        
    const user_id = await createUser({email,password})

    return res.status(201).json({
        status : true,
        message : "Created user successfully !",
        data : user_id
    })
        
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                status: false,
                message: error.message
            });
        }
        console.error('Unexpected error:', error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}


