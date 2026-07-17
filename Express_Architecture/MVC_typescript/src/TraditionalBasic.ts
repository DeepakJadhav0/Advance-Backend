import  express ,{ Request , Response} from "express";
import { createUserDTO } from "./dto/user.dto.js";
import bcrypt from "bcrypt"

type user = {
    user_id : number,
    email : string,
    password : string
}

const users : user[]  = []

const app = express();

app.use(express.json())

app.get("/list" ,(req : Request , res : Response)=>{
    res.status(200).json({
        status : true,
        data : users
    })
})

app.post('/add' ,async (req : Request , res : Response) => {
    const {email , password} = req.body as createUserDTO

    try {

    if(!email || !password){
       return res.status(400).json({
            status : false,
            message : "Missing Resources"
        })
    }

    const emailExists = users.some(u => u.email === email)

    if(emailExists){
        return res.status(400).json({
            status : false,
            message : "Email Already Exists !"
        })
    }

    const hashedPassword = await bcrypt.hash(password , 10)

    const newUser : user = {
        user_id : Date.now(),
        email : email.toLocaleLowerCase().trim(),
        password : hashedPassword
    }

    users.push(newUser)

    return res.status(201).json({
        status : true,
        message : "Created user successfully !",
        data : newUser.user_id
    })
        
    } catch (error) {

    if(error instanceof Error){
        console.error(error)
    }

    return res.status(500).json({
        status : false,
        message : "Internal server error "
    })
        
    }
})

app.listen(8000 , ()=>{
    console.log("Server is running on port 8000");
})

