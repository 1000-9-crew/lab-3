const authService = require("../services/authService");
const createError = require('http-errors');
const { UserCreateDTO, UserAuthDTO } = require("../model/User");

exports.login = async (req, res, next) => {
    const { login, password } = req.matchedData;

    try {
        const user = await authService.login(new UserAuthDTO(login, password));

        req.session.regenerate((err) => {
            if (err) return next(createError("Session regeneration failed"));
            req.session.user = { id: user.id };
            res.redirect("/");
        });
    }
    catch (err) {
        next(err);
    };
};

exports.register = async (req, res, next) => {
    const { name, login, password, role } = req.matchedData;

    try {
        await authService.register(new UserCreateDTO(name, login, password, role));
        res.redirect("/login");
    }
    catch (err) {
        next(err);
    };
};

exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(createError("Session destroy failed"));
        // dont need
        // res.clearCookie("connect.sid"); // Remove session cookie
        res.redirect("/");
    });
};