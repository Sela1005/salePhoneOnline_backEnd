import { Request, Response } from 'express';
import * as JwtService from '../services/JwtService';
import { OAuth2Client } from 'google-auth-library';
import * as UserService from '../services/UserService';

const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password, confirmPassword } = req.body;

        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);
        const isCheckGmail = email.endsWith('@gmail.com');

        const passwordReg = /^(?=.*[A-Z]).{6,15}$/;
        const isCheckPass = passwordReg.test(password);

        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: "ERR",
                message: "Hãy nhập đầy đủ thông tin"
            });
        } else if (!isCheckEmail || !isCheckGmail) {
            return res.status(200).json({
                status: "ERR",
                message: "Hãy nhập email hợp lệ và có đuôi @gmail.com"
            });
        } else if (!isCheckPass) {
            return res.status(200).json({
                status: "ERR",
                message: "Mật khẩu phải có ít nhất 1 ký tự viết hoa và ít nhất 6 ký tự"
            });
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: "ERR",
                message: "Hãy nhập mật khẩu và nhập lại mật khẩu trùng khớp"
            });
        }

        const existingUser = await UserService.getUserByEmail(email);
        if (existingUser) {
            return res.status(200).json({
                status: "ERR",
                message: "Email này đã được đăng ký, vui lòng chọn email khác"
            });
        }

        const response = await UserService.createUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is required"
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is email"
            });
        }
        const response = await UserService.loginUser(req.body);
        const { refresh_token, ...newRespone } = response;
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });
        return res.status(200).json(newRespone);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required"
            });
        }
        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required"
            });
        }
        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const getAllUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await UserService.getAllUser();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const getDetailsUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required"
            });
        }
        const response = await UserService.getDetailsUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
        const token = req.cookies.refresh_token;
        if (!token) {
            return res.status(200).json({
                status: "ERR",
                message: "The token is required"
            });
        }
        const response = await JwtService.refreshTokenJwtService(token);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const logoutUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({
            status: 'OK',
            message: 'Logout Successfully'
        });
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginWithGoogle = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { idToken } = req.body;
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({ status: "ERR", message: "Invalid token payload" });
        }
        const { email, name, picture } = payload;

        if (!email || !name || !picture) {
            return res.status(400).json({ status: "ERR", message: "Invalid token payload" });
        }

        const response = await UserService.findOrCreateUser({ email, name, picture });
        const { refresh_token } = response.data;

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ status: "ERR", message: "Đăng nhập không thành công!", error: (error as any).message });
    }
};

export {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    loginWithGoogle
};
