import { User, UserModel } from "../models/user";

export class UserDao {
    create(user: User): Promise<User> {
        const userInfo = UserModel.create(user);
        return userInfo;
    }
}
