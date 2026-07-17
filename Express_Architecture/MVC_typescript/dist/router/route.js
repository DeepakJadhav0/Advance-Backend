import { Router } from "express";
import { userRouter } from "./user.route.js";
export const route = Router();
route.use("/users", userRouter);
//# sourceMappingURL=route.js.map