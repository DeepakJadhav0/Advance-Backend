import { createUser, findUserByEmail, getAllUsers } from "../model/user.model.js";
export async function userList(req, res) {
    const users = getAllUsers();
    res.status(200).json({
        status: true,
        data: users
    });
}
export async function addUser(req, res) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Missing Resources"
            });
        }
        const emailExists = findUserByEmail(email);
        if (emailExists) {
            return res.status(400).json({
                status: false,
                message: "Email Already Exists !"
            });
        }
        const user_id = await createUser(email, password);
        return res.status(201).json({
            status: true,
            message: "Created user successfully !",
            data: user_id
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error);
        }
        return res.status(500).json({
            status: false,
            message: "Internal server error "
        });
    }
}
//# sourceMappingURL=user.controller.js.map