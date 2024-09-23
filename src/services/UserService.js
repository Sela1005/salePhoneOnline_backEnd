const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")
const { JsonWebTokenError } = require("jsonwebtoken")

const createUser = (newUser) => {
    return new Promise( async (resolve, reject) => {
        const {name, email, password} = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
           if(checkUser !== null) {
                resolve({
                    status: "ERR",
                    message: "Email đã tồn tại!"
                })
           }
           const hash = bcrypt.hashSync(password, 10)
            const createUser =await User.create({ //createdUser
                name,
                email, 
                password: hash
            })
            if(createUser){
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise( async (resolve, reject) => {
        const {email, password} = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
           if(checkUser == null) {
                resolve({
                    status: "ERR",
                    message: "Không tìm thấy người dùng!"
                })
           }
           const comparePassword = bcrypt.compareSync(password,checkUser.password)
            if(!comparePassword){
                resolve({
                    status: "ERR",
                    message: "Email hoặc Mật khẩu sai!"
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: "OK",
                message: "SUCCESS",
                access_token,
                refresh_token
                })
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id,data) => {
    return new Promise( async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id

            })
           if(checkUser == null) {
                resolve({
                    status: "OK",
                    message: "The user is not defined"
                })
           }
           const updatedUser = await User.findByIdAndUpdate(id, data, {new: true})
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updatedUser
                })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise( async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id

            })
           if(checkUser == null) {
                resolve({
                    status: "OK",
                    message: "The user is not defined"
                })
           }
           
           await User.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "DELETE USER SUCCESS",
                })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise( async (resolve, reject) => {
        try {
           const allUser= await User.find()
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: allUser
                })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise( async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
           if(user == null) {
                resolve({
                    status: "OK",
                    message: "The user is not defined"
                })
           }
           
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: user
                })
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser
}