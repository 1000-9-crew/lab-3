const journalRepository = require('../repositories/journalRepository');
const createError = require('http-errors');

exports.getSubjects = async (teacherId) => {
    const subjects = await journalRepository.findSubjectsByTeacherId(teacherId);

    return subjects.map(subject => {
        return {
            id: subject.id,
            name: subject.name,
            //teacherId: subject.teacherId,
        };
    });
};

exports.getSubject = async (teacherId, subjectId) => {
    const subject = await journalRepository.findSubjectById(subjectId);
    if (!subject) throw new createError(404, "Subject not found");
    // check if subject belongs to teacher
    if (subject.teacherId !== teacherId) throw createError(403);
    return subject;
};

exports.getSubjectLessons = async (teacherId, subjectId) => {
    const subject = await this.getSubject(teacherId, subjectId);
    const lessons = await journalRepository.findLessonsBySubjectId(subjectId);

    return lessons; // [{ id, name, date, subjectId }]
};

exports.getEnrolledStudents = async (teacherId, subjectId) => {
    const subject = await this.getSubject(teacherId, subjectId);

    const enrolledStudents = await journalRepository.findEnrolledStudentsBySubjectId(subjectId);
    return enrolledStudents; // [{ id, name }]
};

exports.getUnenrolledStudents = async (teacherId, subjectId) => {
    const subject = await this.getSubject(teacherId, subjectId);

    const unEnrolledStudents = await journalRepository.findUnEnrolledStudentsBySubjectId(subjectId);
    return unEnrolledStudents; // [{ id, name }]
};


exports.getLesson = async (teacherId, lessonId) => {
    const lesson = await journalRepository.findLessonById(lessonId);
    if (!lesson) throw createError(404, "Lesson not found");

    // check if lesson belongs to teacher
    const subject = await this.getSubject(teacherId, lesson.subjectId);

    return lesson; // { id, name, date, subjectId }
};

exports.getLessonMarks = async (teacherId, lessonId) => {
    const lesson = await this.getLesson(teacherId, lessonId); // check if lesson exists and belongs to teacher

    const marks = await journalRepository.findMarksWithStudentByLessonId(lessonId);

    return marks; // [{ id, student, mark, attendance }]
};




exports.createSubject = async (teacherId, subject) => { // { name }
    const createdSubject = await journalRepository.insertSubject({ teacherId, ...subject });
    return createdSubject; // { id, name, teacherId }
};

exports.createLesson = async (teacherId, subjectId, lesson) => { // { name, date }
    const subject = await this.getSubject(teacherId, subjectId);

    const createdLesson = await journalRepository.insertLesson({ subjectId, ...lesson });
    return createdLesson; // { id, name, date, subjectId }
};

exports.deleteLesson = async (teacherId, lessonId) => {
    const lesson = await this.getLesson(teacherId, lessonId); // check if lesson exists and belongs to teacher

    const removedLesson = await journalRepository.removeLessonById(lessonId);
    return removedLesson;
};

exports.createMark = async (teacherId, lessonId, studentId, mark) => { // { mark, attendance }
    const lesson = await this.getLesson(teacherId, lessonId); // check if lesson exists and belongs to teacher
    const student = await journalRepository.findStudentById(studentId); // check if student exists
    if (!student) throw createError(404, "Student not found");

    // check if student is enrolled in the subject of the lesson
    const isEnrolled = await journalRepository.findEnrollmentBySubjectIdAndStudentId(lesson.subjectId, studentId);
    if (!isEnrolled) throw createError(403, "Student is not enrolled in the subject");

    const createdMark = await journalRepository.insertMark({ lessonId, studentId, ...mark });
    return createdMark; // { id, lessonId, studentId, mark, attendance }
};

exports.deleteMark = async (teacherId, markId) => {
    const mark = await journalRepository.findMarkById(markId); // check if mark exists
    if (!mark) throw createError(404, "Mark not found");

    const lesson = await this.getLesson(teacherId, mark.lessonId); // check if lesson exists and belongs to teacher

    const removedMark = await journalRepository.removeMarkById(markId);
    return removedMark; // { id, lessonId, studentId, mark, attendance }
};

exports.editMark = async (teacherId, markId, mark) => { // { mark, attendance }
    const markToEdit = await journalRepository.findMarkById(markId); // check if mark exists
    if (!markToEdit) throw createError(404, "Mark not found");

    const lesson = await this.getLesson(teacherId, markToEdit.lessonId); // check if lesson exists and belongs to teacher

    const updatedMark = await journalRepository.updateMarkById(markId, mark);
    return updatedMark; // { id, lessonId, studentId, mark, attendance }
};

exports.enrollStudent = async (teacherId, subjectId, studentId) => {
    const subject = await this.getSubject(teacherId, subjectId); // check if subject exists and belongs to teacher
    const student = await journalRepository.findStudentById(studentId); // check if student exists
    if (!student) throw createError(404, "Student not found");

    // check if student is already enrolled in the subject
    const isEnrolled = await journalRepository.findEnrollmentBySubjectIdAndStudentId(subjectId, studentId);
    if (isEnrolled) throw createError(409, "Student is already enrolled in the subject");

    const createdEnrollment = await journalRepository.insertEnrollment({ subjectId, studentId });
    return createdEnrollment; // { subjectId, studentId }
};

exports.unEnrollStudent = async (teacherId, subjectId, studentId) => {
    const subject = await this.getSubject(teacherId, subjectId); // check if subject exists and belongs to teacher
    const student = await journalRepository.findStudentById(studentId); // check if student exists
    if (!student) throw new createError(404, "Student not found");

    // check if student is enrolled in the subject
    const isEnrolled = await journalRepository.findEnrollmentBySubjectIdAndStudentId(subjectId, studentId);
    if (!isEnrolled) throw createError(403, "Student is not enrolled in the subject");

    const removedEnrollment = await journalRepository.removeEnrollmentBySubjectIdAndStudentId(subjectId, studentId);
    return removedEnrollment; // { subjectId, studentId }
};