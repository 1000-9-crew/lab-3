const teacherService = require("../services/teacherService");

exports.getSubjects = async (req, res, next) => {
    try {
        res.render("teacher/subjects", {
            user: res.locals.user,
            subjects: await teacherService.getSubjects(res.locals.user.id),
            // [
            //     { id: 1, name: "Swagalogy" },
            //     { id: 2, name: ".Net" },
            // ]
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
            // [
            //     { id: 1, name: "Lesson 1", date: "2023-10-01" },
            //     { id: 2, name: "Lesson 2", date: "2023-10-02" },
            //     { id: 3, name: "Lesson 3", date: "2023-10-03" }
            // ],
            students: {
                enrolled: await teacherService.getEnrolledStudents(res.locals.user.id, subject_id),
                unenrolled: await teacherService.getUnenrolledStudents(res.locals.user.id, subject_id)
            }
            // students: {
            //     enrolled: [
            //         { id: 1, name: "хтось хтось хтось хтось" },
            //         { id: 2, name: "хтось хтось хтось тіпа" }
            //     ],
            //     unenrolled: [
            //         { id: 1, name: "хтось хтось хтось хтось" },
            //         { id: 2, name: "хтось хтось хтось тіпа" },
            //     ]
            // }
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
            // [
            //     {
            //         id: 1,
            //         student: { id: 1, name: "хтось хтось хтось хтось" },
            //         mark: 52,
            //         attendance: true
            //     },
            //     {
            //         id: 2,
            //         student: { id: 2, name: "хтось хтось хтось" },
            //         mark: 89,
            //         attendance: false
            //     },

        });
    }
    catch (err) {
        next(err);
    }
};



exports.createSubject = async (req, res, next) => {
    const { name } = req.matchedData;

    try {
        await teacherService.createSubject(res.locals.user.id, { name });
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
        await teacherService.createLesson(res.locals.user.id, subject_id, { name, date });
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
        await teacherService.createMark(res.locals.user.id, lesson_id, studentId, { mark, attendance });
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
        await teacherService.editMark(res.locals.user.id, mark_id, { mark, attendance });
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