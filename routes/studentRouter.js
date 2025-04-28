const express = require('express');
const router = express.Router();
const { checkRole, getUserInfo } = require("../middleware/authMiddleware");
const studentController = require("../controllers/studentController");
const createError = require('http-errors');

router.use(getUserInfo);
router.use(checkRole("student"));

router.param('subject_id', async (req, res, next, value) => {
    req.params.subject_id = parseInt(value, 10);
    if (isNaN(req.params.subject_id)) {
        return next(createError(400, "Invalid subject_id. It must be an integer."));
    }
    next();
});

// Subjects
router.get("/subjects", studentController.getSubjects);

// Marks
router.get("/subjects/:subject_id", studentController.getSubjectMarks);


module.exports = router;