import User from "../models/UserModel";
import bcrypt from "bcrypt";
import { genneralAccessToken, genneralRefreshToken } from "./JwtService";
import { JsonWebTokenError } from "jsonwebtoken";
import Order from "../models/UserModel";

interface NewUser {
    name: string;
    email: string;
    password: string;
}

interface UserLogin {
    email: string;
    password: string;
}

interface UpdateUserData {
    name?: string;
    email?: string;
    isAdmin?: boolean | string;
    phone?: number;
    address?: string;
    city?: string;
    role?: string;
}

const createUser = (newUser: NewUser): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password } = newUser;
        try {
            const checkUser = await User.findOne({ email });
            if (checkUser !== null) {
                resolve({
                    status: "ERR",
                    message: "Email đã tồn tại!"
                });
            }
            const hash = bcrypt.hashSync(password, 10);
            const createUser = await User.create({
                name,
                email,
                password: hash
            });
            if (createUser) {
                resolve({
                    status: "OK",
                    message: "Đăng ký thành công!",
                    data: createUser
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getUserByEmail = async (email: string): Promise<any> => {
    try {
        return await User.findOne({ email });
    } catch (e) {
        throw e;
    }
};

const loginUser = (userLogin: UserLogin): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({ email });
            if (checkUser == null) {
                return resolve({
                    status: "ERR",
                    message: "Không tìm thấy người dùng!"
                });
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                return resolve({
                    status: "ERR",
                    message: "Email hoặc Mật khẩu sai!"
                });
            }
            const access_token = genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            });
            const refresh_token = genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            });

            resolve({
                status: "OK",
                message: "Đăng nhập thành công",
                access_token,
                refresh_token
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateUser = (id: string, data: UpdateUserData): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            if (checkUser == null) {
                return resolve({
                    status: "ERR",
                    message: "Người dùng không tồn tại",
                });
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: "OK",
                message: "Cập nhật thành công",
                data: updatedUser,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (id: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            if (checkUser == null) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy người dùng!",
                });
            }

            await Order.deleteMany({ user: id });
            await User.findByIdAndDelete(id);

            resolve({
                status: "OK",
                message: "Xóa người dùng thành công",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllUser = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find();
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allUser
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsUser = (id: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id });
            if (user == null) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy người dùng!"
                });
            }

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: user
            });
        } catch (e) {
            reject(e);
        }
    });
};

const findOrCreateUser = async ({ email, name, picture }: { email: string, name: string, picture: string }): Promise<any> => {
    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: bcrypt.hashSync(Date.now().toString(), 10),
                avatar: picture,
                isAdmin: false,
            });
        }

        const access_token = genneralAccessToken({
            id: user._id as string,
            isAdmin: user.isAdmin
        });
        const refresh_token = await genneralRefreshToken({
            id: user._id as string,
            isAdmin: user.isAdmin
        });

        return {
            status: "OK",
            message: "Đăng nhập thành công!",
            data: {
                user,
                access_token,
                refresh_token
            },
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error creating or finding user: " + error.message);
        } else {
            throw new Error("Error creating or finding user");
        }
    }
};

export {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    findOrCreateUser,
    getUserByEmail
};
