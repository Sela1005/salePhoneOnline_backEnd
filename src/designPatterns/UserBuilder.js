// builders/UserBuilder.js

class UserBuilder {
    constructor() {
        this.user = {};
    }

    setName(name) {
        if (typeof name !== 'string' || name.length === 0) {
            throw new Error("Tên không được để trống");
        }
        if (name.length > 25) {
            throw new Error("Tên không được vượt quá 25 ký tự");
        }
        this.user.name = name.trim().toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
        return this;
        //"TÔi là NAM" => "tôi là nam" => "Tôi Là Nam"

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
    
        this.user.email = email.trim().toLowerCase(); // chuẩn hóa: xóa khoảng trắng, chữ thường
        return this;
    }
    
    setPassword(password) {
        this.user.password = password;
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
