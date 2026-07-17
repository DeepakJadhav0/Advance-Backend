import { UserDto } from "../dto/user.dto.js";
export declare function getAllUsers(): UserDto[];
export declare function findUserByEmail(email: string): boolean;
export declare function createUser(email: string, password: string): Promise<number>;
//# sourceMappingURL=user.model.d.ts.map