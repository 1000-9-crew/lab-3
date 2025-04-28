const express = require('express');
const router = express.Router();
const { checkRole, getUserInfo } = require("../middleware/authMiddleware");
const authService = require("../services/authService");
const path = require("path");
const createError = require('http-errors');

router.get("/", async (req, res, next) => {
    const user = req.session.user;
    if (!user) { // no active session
        return res.sendFile(path.join(__dirname, "../public/index.html"));
    }

    try {
        res.locals.user = await authService.getUserProfilebyId(user.id); //userInfo;
        if (res.locals.user.isTeacher()) {
            return res.redirect("/teacher/subjects/");
        }
        else if (res.locals.user.isStudent()) {
            return res.redirect("/student/subjects/");
        }
        else return next(createError(500, "Unknown user role."));
    }
    catch (err) {
        return next(err);
    }
});

module.exports = router;
