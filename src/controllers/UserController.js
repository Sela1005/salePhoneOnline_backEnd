const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')
const { OAuth2Client } = require('google-auth-library');
const createUser = async (req, res) => {
    try {
        const {email, password, confirmPassword} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)

        const passwordReg = /^(?=.*[A-Za-z]).{7,}$/;
        const isCheckPass = passwordReg.test(password)

        if(!email|| !password|| !confirmPassword) {
            return res.status(200).json({
                status: "ERR",
                message: "Hãy nhập đầy đủ thông tin"
            })
        }else if(!isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: "Hãy nhập email hợp lệ"
            })
        }
        else if(!isCheckPass) {
            return res.status(200).json({
                status: "ERR",
                message: "Mật khẩu ít nhất 6 ký tự và ít nhất 1 chữ"
            })
        }else if(password != confirmPassword) {
            return res.status(200).json({
                status: "ERR",
                message: "Hãy nhập mật khẩu và nhập lại mật khẩu trùng khớp"
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}


const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)

        if(!email|| !password) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is required"
            })
        }else if(!isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is email"
            })
        }
        const response = await UserService.loginUser(req.body)
        const {refresh_token, ...newRespone} = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'Strict'
        })
        return res.status(200).json(newRespone)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if(!userId){
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required"
            })
        }
        const response = await UserService.updateUser(userId,data)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required"
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required"
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token
        if(!token){
            return res.status(200).json({
                status: "ERR",
                message: "The token is required"
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {
       res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout Successfully'
        })
    } catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}
//Google


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Lấy client ID từ biến môi trường

const loginWithGoogle = async (req, res) => {
    try {
        const { idToken } = req.body; // Lấy idToken từ body
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID, // Chỉ định client ID
        });

        const payload = ticket.getPayload(); // Lấy thông tin payload từ token

        // Kiểm tra và xử lý người dùng
        const { email, name, picture } = payload; // Lấy thông tin email và name từ payload

        // Gọi service để tìm hoặc tạo người dùng
        const response = await UserService.findOrCreateUser({ email, name, picture }); 

        // Giả sử UserService.findOrCreateUser trả về refresh_token
        const { refresh_token } = response.data; 

        // Lưu refresh_token vào cookie
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'Strict'
        })

        return res.status(200).json(response); // Trả về phản hồi
    } catch (error) {
        return res.status(400).json({ status: "ERR", message: "Login failed", error: error.message });
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
}
