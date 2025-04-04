const User = require("../models/UserModel")
const bcrypt = require("bcryptjs")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")
const { JsonWebTokenError } = require("jsonwebtoken")
const Order = require("../models/OrderProduct")

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
                    message: "Đăng ký thành công!",
                    data: createUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
const getUserByEmail = async (email) => {
    try {
        return await User.findOne({ email: email });
    } catch (e) {
        throw e;
    }
};

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
                message: "Đăng nhập thành công",
                access_token,
                refresh_token
                })
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lọc chỉ các trường được phép cập nhật
            const allowedFields = ['name', 'isAdmin', 'phone', 'address', 'avatar', 'city', 'role'];
            const updateData = {};
            Object.keys(data).forEach(key => {
                if (allowedFields.includes(key)) {
                    updateData[key] = data[key];
                }
            });

            // Kiểm tra các điều kiện của từng trường dữ liệu
            if (updateData.name && updateData.name.length > 25) {
                return resolve({ status: "ERR", message: "Tên không được vượt quá 25 ký tự." });
            }

            if (updateData.isAdmin !== undefined) {
                const isAdmin = (updateData.isAdmin === "true") || (updateData.isAdmin === "false") ? updateData.isAdmin === "true" : updateData.isAdmin;
                if (typeof isAdmin !== "boolean") {
                    return resolve({ status: "ERR", message: "isAdmin phải là true hoặc false." });
                }
                updateData.isAdmin = isAdmin;
            }

            if (updateData.phone) {
                const phoneStr = updateData.phone.toString();
                if (!/^\d+$/.test(phoneStr)) {
                    return resolve({ status: "ERR", message: "Số điện thoại phải là số." });
                }
                if (phoneStr.length > 20 || phoneStr.length < 7) {
                    return resolve({ status: "ERR", message: "Số điện thoại phải có từ 7 đến 20 số." });
                }
            }

            if (updateData.address && updateData.address.length > 100) {
                return resolve({ status: "ERR", message: "Địa chỉ quá dài." });
            }

            if (updateData.city && updateData.city.length > 100) {
                return resolve({ status: "ERR", message: "Tên thành phố quá dài." });
            }

            if (updateData.role && updateData.role.length > 20) {
                return resolve({ status: "ERR", message: "Vai trò quá dài." });
            }

            const checkUser = await User.findOne({ _id: id });
            if (checkUser == null) {
                return resolve({
                    status: "ERR",
                    message: "Người dùng không tồn tại",
                });
            }

            const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
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

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            if (checkUser == null) {
                resolve({
                    status: "OK",
                    message: "Không tìm thấy người dùng!",
                });
            }

            // Xóa tất cả các đơn hàng của người dùng trước khi xóa người dùng
            await Order.deleteMany({ user: id });

            // Xóa người dùng
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
                    message: "Không tìm thấy người dùng!"
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
//Google
const findOrCreateUser = async ({ email, name, picture }) => {
    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        let user = await User.findOne({ email });

        // Nếu người dùng chưa tồn tại, tạo mới
        if (!user) {
            user = await User.create({
                name,
                email,
                password: bcrypt.hashSync(Date.now().toString(), 10), // Tạo password giả
                avatar: picture,
                isAdmin: false, // Có thể thay đổi theo yêu cầu
            });
        }

        // Tạo access_token với _id của người dùng
        const access_token = genneralAccessToken({
            id: user._id, // Sử dụng _id của người dùng
            isAdmin: user.isAdmin
        });
        const refresh_token = await genneralRefreshToken({
            id: user._id,
            isAdmin: user.isAdmin
        })

        // Nếu người dùng đã tồn tại, chỉ trả về thông tin người dùng cùng với access_token
        return {
            status: "OK",
            message: "Đăng nhập thành công!",
            data: {
                user,
                access_token, // Trả về access_token
                refresh_token
            },
        };
    } catch (error) {
        reject(error)
    }
};

const changePassword = (userId, oldPassword, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: userId })
            if (!user) {
                resolve({
                    status: "ERR",
                    message: "Không tìm thấy người dùng"
                })
            }

            const isMatchPassword = bcrypt.compareSync(oldPassword, user.password)
            if (!isMatchPassword) {
                resolve({
                    status: "ERR",
                    message: "Mật khẩu cũ không đúng"
                })
            }

            const hash = bcrypt.hashSync(newPassword, 10)
            await User.findByIdAndUpdate(
                userId,
                { password: hash }
            )

            resolve({
                status: "OK",
                message: "Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại!"
            })
        } catch (e) {
            reject(e)
        }
    })
}

const adminChangePassword = (userId, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: userId })
            if (!user) {
                resolve({
                    status: "ERR",
                    message: "Không tìm thấy người dùng"
                })
            }

            const hash = bcrypt.hashSync(newPassword, 10)
            await User.findByIdAndUpdate(
                userId,
                { password: hash }
            )

            resolve({
                status: "OK",
                message: "Thay đổi mật khẩu thành công"
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
    getDetailsUser,
    findOrCreateUser,
    getUserByEmail,
    changePassword,
    adminChangePassword
}