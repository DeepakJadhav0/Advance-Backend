import { Router } from "express";
import { addUser, userList } from "../controller/user.controller.js";
export const userRouter = Router();
userRouter.get("/", userList);
userRouter.post("/", addUser);
//# sourceMappingURL=user.route.js.map