const userRepository = require("../repositories/userRepository");
const createError = require('http-errors');

exports.login = async (login, password) => {
    const user = await userRepository.findByLogin(login);

    if (!user || user.password !== password) {
        throw createError(401, "Invalid login or password");
    };

    return user;
}

exports.register = async (name, login, password, role) => {
    const existingUser = await userRepository.findByLogin(login);
    if (existingUser) {
        throw createError(409, "Login already in use");
    };

    return await userRepository.insert(name, login, password, role);
}

exports.getUserProfilebyId = async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
        throw createError("User not found");
    };

    return {
        id: user.id,
        name: user.name,
        role: user.role
    };
}
