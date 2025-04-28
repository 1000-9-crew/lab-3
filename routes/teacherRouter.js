const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { checkRole, getUserInfo } = require("../middleware/authMiddleware");
const teacherController = require("../controllers/teacherController");
const { validateCreateSubject,
        validateCreateLesson,
        validateCreateMark,
        validateEditMark,
        validateEnrollment,
        handleValidationErrors } = require("../middleware/validators");

router.use(getUserInfo);
router.use(checkRole("teacher"));

router.param('subject_id', async (req, res, next, value) => {
    req.params.subject_id = parseInt(value, 10);
    if (isNaN(req.params.subject_id)) {
        return next(createError(400, "Invalid subject_id. It must be an integer."));
    }
    next();
});

router.param('lesson_id', (req, res, next, value) => {
    req.params.lesson_id = parseInt(value, 10);
    if (isNaN(req.params.lesson_id)) {
        return next(createError(400, "Invalid lesson_id. It must be an integer."));
    }
    next();
});

router.param('mark_id', (req, res, next, value) => {
    req.params.mark_id = parseInt(value, 10);
    if (isNaN(req.params.mark_id)) {
        return next(createError(400, "Invalid mark_id. It must be an integer."));
    }
    next();
});

// Subjects
router.get("/subjects/", teacherController.getSubjects);
router.get("/subjects/:subject_id/", teacherController.getSubjectInfo);
router.post("/subjects/create", validateCreateSubject, handleValidationErrors, teacherController.createSubject);
router.post("/subjects/:subject_id/enrollStudent", validateEnrollment, handleValidationErrors, teacherController.enrollStudent);
router.post("/subjects/:subject_id/unenrollStudent", validateEnrollment, handleValidationErrors, teacherController.unEnrollStudent);

// Lessons
router.get("/subjects/:subject_id/lessons/:lesson_id", teacherController.getLessonJournal);
router.post("/subjects/:subject_id/lessons/create", validateCreateLesson, handleValidationErrors, teacherController.createLesson);
router.post("/subjects/:subject_id/lessons/:lesson_id/delete", teacherController.deleteLesson);

// Marks
router.post("/subjects/:subject_id/lessons/:lesson_id/marks/create", validateCreateMark, handleValidationErrors, teacherController.createMark);
router.post("/subjects/:subject_id/lessons/:lesson_id/marks/:mark_id/delete", teacherController.deleteMark);
router.post("/subjects/:subject_id/lessons/:lesson_id/marks/:mark_id/update", validateEditMark, handleValidationErrors, teacherController.editMark);


module.exports = router;