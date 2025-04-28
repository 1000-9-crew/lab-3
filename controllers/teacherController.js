const teacherService = require("../services/teacherService");
const { SubjectCreateDTO } = require("../model/Subject");
const { LessonCreateDTO } = require("../model/Lesson");
const { MarkCreateDTO, MarkUpdateDTO } = require("../model/Mark");

exports.getSubjects = async (req, res, next) => {
    try {
        res.render("teacher/subjects", {
            user: res.locals.user,
            subjects: await teacherService.getSubjects(res.locals.user.id),
        });
    }
    catch (err) {
        next(err);
    }
};

exports.getSubjectInfo = async (req, res, next) => {
    const { subject_id } = req.params;

    try {
        res.render("teacher/lessons", {
            user: res.locals.user,
            subject: await teacherService.getSubject(res.locals.user.id, subject_id),
            lessons: await teacherService.getSubjectLessons(res.locals.user.id, subject_id),
            students: {
                enrolled: await teacherService.getEnrolledStudents(res.locals.user.id, subject_id),
                unenrolled: await teacherService.getUnenrolledStudents(res.locals.user.id, subject_id)
            }
        });
    }
    catch (err) {
        next(err);
    }
};

exports.getLessonJournal = async (req, res, next) => {
    const { subject_id, lesson_id } = req.params;

    try {
        res.render("teacher/journal", {
            user: res.locals.user,
            subject: await teacherService.getSubject(res.locals.user.id, subject_id),
            lesson: await teacherService.getLesson(res.locals.user.id, lesson_id),
            students: await teacherService.getEnrolledStudents(res.locals.user.id, subject_id),
            marks: await teacherService.getLessonMarks(res.locals.user.id, lesson_id),
        });
    }
    catch (err) {
        next(err);
    }
};



exports.createSubject = async (req, res, next) => {
    const { name } = req.matchedData;

    try {
        await teacherService.createSubject(res.locals.user.id, new SubjectCreateDTO(name));
        return res.redirect('back');
    }
    catch (err) {
        next(err);
    }
};

exports.createLesson = async (req, res, next) => {
    const { subject_id } = req.params;
    const { name, date } = req.matchedData;

    try {
        await teacherService.createLesson(res.locals.user.id, subject_id, new LessonCreateDTO(name, date));
        return res.redirect('back');
    }
    catch (err) {
        next(err);
    }
};

exports.deleteLesson = async (req, res, next) => {
    const { subject_id, lesson_id } = req.params;

    try {
        await teacherService.deleteLesson(res.locals.user.id, lesson_id);
        return res.redirect('back');
    }
    catch (err) {
        next(err);
    }
};

exports.createMark = async (req, res, next) => {
    const { subject_id, lesson_id } = req.params;
    const { studentId, mark, attendance } = req.matchedData;

    try {
        await teacherService.createMark(res.locals.user.id, lesson_id, studentId, new MarkCreateDTO(mark, attendance));
        return res.redirect('back');
    }
    catch (err) {
        next(err);
    }
};

exports.deleteMark = async (req, res, next) => {
    const { subject_id, lesson_id, mark_id } = req.params;

    try {
        await teacherService.deleteMark(res.locals.user.id, mark_id);
        return res.redirect('back');
    }
    catch (err) {
        next(err);
    }
};

exports.editMark = async (req, res, next) => {
    const { subject_id, lesson_id, mark_id } = req.params;
    const { mark, attendance } = req.matchedData;

    try {
        await teacherService.editMark(res.locals.user.id, mark_id, new MarkUpdateDTO(mark, attendance));
        return res.redirect('back');
    }
    catch (err) {
        next(err);
    }
};

exports.enrollStudent = async (req, res, next) => {
    const { subjectId, studentId } = req.matchedData;

    try {
        await teacherService.enrollStudent(res.locals.user.id, subjectId, studentId);
        return res.redirect('back');
    }
    catch (err) {
        next(err);
    }
}

exports.unEnrollStudent = async (req, res, next) => {
    const { subjectId, studentId } = req.matchedData;

    try {
        await teacherService.unEnrollStudent(res.locals.user.id, subjectId, studentId);
        return res.redirect('back');
    }
    catch (err) {
        next(err);
    }
}