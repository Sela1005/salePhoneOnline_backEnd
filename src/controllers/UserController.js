const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');
const UserBuilder = require('../designPatterns/Builder/UserBuilder'); // Sửa đường dẫn
const UserDirector = require('../designPatterns/Builder/Director/UserDirector'); // Sửa đường dẫn
const { OAuth2Client } = require('google-auth-library');

const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            confirmPassword,
            address,
            phone,
            role,
            city,
            avatar
        } = req.body;

        // ✅ Kiểm tra mật khẩu xác nhận
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: "Nguyen_ERR_CONFIRM",
                message: "Mật khẩu xác nhận không khớp"
            });
        }

        // ✅ Dùng Builder + Director
        const builder = new UserBuilder();
        const director = new UserDirector(builder);

        let newUser;

        try {
            newUser = director.constructFullUser({
                name,
                email,
                password,
                confirmPassword,
                phone,
                address,
                role,
                city,
                avatar
            });
        } catch (builderError) {
            return res.status(400).json({
                status: "Nguyen_ERR_BUILDER",
                message: builderError.message
            });
        }

        // ✅ Gửi user sang service
        const response = await UserService.createUser(newUser);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(500).json({
            status: "Nguyen_ERR_UNKNOWN",
            message: e.message
        });
    }
};

// ✅ Đăng nhập
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

        if (!email || !password) {
            return res.status(200).json({
                status: "ERR_NguyenMTK",
                message: "The input is required"
            });
        }

        if (!reg.test(email)) {
            return res.status(200).json({
                status: "ERR_NguyenMTK",
                message: "The email is invalid"
            });
        }

        const response = await UserService.loginUser(req.body);
        const { refresh_token, ...newResponse } = response;

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict'
        });

        return res.status(200).json(newResponse);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

// ✅ Cập nhật người dùng
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;

        if (!userId) {
            return res.status(200).json({ status: "ERR_NguyenMTK", message: "The userId is required" });
        }

        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

// ✅ Xóa người dùng
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({ status: "ERR_NguyenMTK", message: "The userId is required" });
        }

        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

// ✅ Lấy tất cả người dùng
const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

// ✅ Lấy chi tiết người dùng
const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({ status: "ERR_NguyenMTK", message: "The userId is required" });
        }

        const response = await UserService.getDetailsUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

// ✅ Làm mới token
const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if (!token) {
            return res.status(200).json({ status: "ERR_NguyenMTK", message: "The token is required" });
        }

        const response = await JwtService.refreshTokenJwtService(token);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

// ✅ Đăng xuất
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({
            status: 'Nguyen_OK',
            message: 'Logout Successfully'
        });
    } catch (e) {
        return res.status(404).json({ message: e.message });
    }
};

// ✅ Đăng nhập với Google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginWithGoogle = async (req, res) => {
    try {
        const { idToken } = req.body;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        const response = await UserService.findOrCreateUser({ email, name, picture });

        const { refresh_token } = response.data;

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict'
        });

        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({
            status: "Nguyen_ERR",
            message: "Đăng nhập không thành công!",
            error: error.message
        });
    }
};

module.exports = {
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
