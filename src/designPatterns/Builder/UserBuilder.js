// designPatterns/Builder/UserBuilder.js

class UserBuilder {
    constructor() {
        this.user = {};
    }

    setName(name) {
        if (name) {
            if (typeof name !== 'string') {
                throw new Error("Tên phải là chuỗi");
            }
            if (name.length > 25) {
                throw new Error("Tên không được vượt quá 25 ký tự");
            }
    
            this.user.name = name.trim().toLowerCase().replace(/\b[a-z]/g, letter => letter.toUpperCase());
        }
        return this;
    }
    setEmail(email) {
        const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    
        if (!email || typeof email !== 'string') {
            throw new Error("Email không hợp lệ");
        }
    
        if (!reg.test(email)) {
            throw new Error("Email sai định dạng");
        }
    
        if (!email.endsWith("@gmail.com")) {
            throw new Error("Email phải có đuôi @gmail.com");
        }
    
        this.user.email = email.trim().toLowerCase();
        return this;
    }

    setPassword(password) {
        if (!password) {
            throw new Error("Mật khẩu không được để trống");
        }
        const regex = /^(?=.*[A-Z]).{6,15}$/;
        if (!regex.test(password)) {
            throw new Error("Mật khẩu phải từ 6-15 ký tự, có ít nhất 1 ký tự viết hoa");
        }
        this.user.password = password;
        return this;
    }
    build() {
        if (this.user.confirmPassword && this.user.password !== this.user.confirmPassword) {
            throw new Error("Mật khẩu và xác nhận mật khẩu không khớp");
        }
        delete this.user.confirmPassword; // Không lưu confirmPassword vào DB
        return this.user;
    }
    
    setConfirmPassword(confirmPassword) {
        if (typeof confirmPassword !== 'string') {
            throw new Error("Xác nhận mật khẩu không hợp lệ");
        }
        this.user.confirmPassword = confirmPassword;
        return this;
    }

    setAvatar(avatar) {
        this.user.avatar = avatar;
        return this;
    }

    setPhone(phone) {
        this.user.phone = phone;
        return this;
    }

    setAddress(address) {
        this.user.address = address;
        return this;
    }

    setRole(role) {
        this.user.role = role;
        return this;
    }

    setIsAdmin(isAdmin) {
        this.user.isAdmin = isAdmin;
        return this;
    }

    setCity(city) {
        this.user.city = city;
        return this;
    }

    build() {
        return this.user;
    }
}

module.exports = UserBuilder;
