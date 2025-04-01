const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");

class UserTemplate {
    async createUser(data) {
        const { name, email, password } = data;

        // Bước 1: Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { status: "ERR", message: "Email đã tồn tại!" };
        }

        // Bước 2: Hash mật khẩu
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Bước 3: Gọi phương thức cụ thể để xử lý vai trò
        const roleData = this.setRoleData();

        // Bước 4: Tạo người dùng
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            ...roleData,
        });

        return { status: "OK", message: "Đăng ký thành công!", data: newUser };
    }

    // Phương thức cần được ghi đè bởi các lớp con
    setRoleData() {
        throw new Error("Phương thức setRoleData phải được ghi đè!");
    }
}

class NhanVienIT extends UserTemplate {
    setRoleData() {
        return { role: "NhanVienIT", isAdmin: true };
    }
}

class KeToan extends UserTemplate {
    setRoleData() {
        return { role: "KeToan", isAdmin: true };
    }
}

class ThuKho extends UserTemplate {
    setRoleData() {
        return { role: "ThuKho", isAdmin: true };
    }
}

class QuanLy extends UserTemplate {
    setRoleData() {
        return { role: "QuanLy", isAdmin: true };
    }
}

module.exports = { NhanVienIT, KeToan, ThuKho, QuanLy };
