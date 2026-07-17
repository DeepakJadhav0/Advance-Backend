import bcrypt from "bcrypt";
const users = [];
export function getAllUsers() {
    return users.map(({ user_id, email }) => ({
        user_id,
        email,
    }));
}
export function findUserByEmail(email) {
    return users.some(u => u.email === email);
}
export async function createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        user_id: Date.now(),
        email: email.toLocaleLowerCase().trim(),
        password: hashedPassword
    };
    users.push(newUser);
    return newUser.user_id;
}
//# sourceMappingURL=user.model.js.map