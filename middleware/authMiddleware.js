const authService = require("../services/authService");
const createError = require('http-errors');

exports.checkRole = (role) => {
    return (req, res, next) => {
        if (res.locals.user.role === role) { // req.session.user &&
            return next();
        }
        return next(createError(403));
    };
};

exports.getUserInfo = async (req, res, next) => {
    const user = req.session.user;
    if (!user) { // no active session
        return next(createError(401));
        return res.redirect("/");
    }

    try {
        res.locals.user = await authService.getUserProfilebyId(user.id);
        next();
    }
    catch (err) {
        return next(err);
    }
}
