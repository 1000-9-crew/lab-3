const userRepository = require("../repositories/userRepository");
const createError = require('http-errors');
const { UserProfile } = require("../model/User");

exports.login = async (userAuthDTO) => {
    const user = await userRepository.findByLogin(userAuthDTO.login);

    if (!user || user.password !== userAuthDTO.password) {
        throw createError(401, "Invalid login or password");
    };

    return UserProfile.fromUser(user);
}

exports.register = async (userCreateDTO) => {
    const existingUser = await userRepository.findByLogin(userCreateDTO.login);
    if (existingUser) {
        throw createError(409, "Login already in use");
    };

    return await userRepository.insert(userCreateDTO);
}

exports.getUserProfilebyId = async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
        throw createError("User not found");
    };

    return UserProfile.fromUser(user);
}
