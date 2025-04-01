// designPatterns/Builder/Director/UserDirector.js

class UserDirector {
    constructor(builder) {
        this.builder = builder;
    }

    constructBasicUser({ name, email, password }) {
        return this.builder
            .setName(name)
            .setEmail(email)
            .setPassword(password)
            .build();
    }

    constructFullUser({ name, email, password, confirmPassword, phone, address, role, isAdmin, avatar, city }) {
        return this.builder
            .setName(name)
            .setEmail(email)
            .setPassword(password)
            .setConfirmPassword(confirmPassword)
            .setPhone(phone)
            .setAddress(address)
            .setRole(role)
            .setIsAdmin(isAdmin)
            .setAvatar(avatar)
            .setCity(city)
            .build();
    }
    constructStandardUser(name, email, password) {
        return this.builder
            .setName(name)
            .setEmail(email)
            .setPassword(password)
            .build();
    }

    constructGoogleUser(name, email, avatar) {
        return this.builder
            .setName(name)
            .setEmail(email)
            .setAvatar(avatar)
            .setPassword(Date.now().toString()) // Mật khẩu giả
            .build();
    }
}

module.exports = UserDirector;
