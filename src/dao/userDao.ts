import { User, UserModel } from "../models/user";

export class UserDao {
    create(user: Omit<User, "createdAt" | "updatedAt">): Promise<User> {
        const userInfo = UserModel.create(user);
        return userInfo;
    }

    findAll(): Promise<User[]> {
        const userInfo = UserModel.find();
        return userInfo;
    }
}
