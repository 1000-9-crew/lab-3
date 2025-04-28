const journalRepository = require("../repositories/journalRepository");
const createError = require('http-errors');

exports.getSubjects = async (studentId) => {
    subjects = await journalRepository.findSubjectsbyStudentId(studentId);
    return subjects;
};

exports.getSubjectJournal = async (studentId, subjectId) => {
    const subject = await journalRepository.findSubjectById(subjectId);
    if (!subject) throw createError(404, "Subject not found");

    // find marks by studentId and subjectId with JOIN lesson name and date
    const marks = await journalRepository.findMarksByStudentIdAndSubjectId(studentId, subjectId);

    return {
        subject: subject,
        marks: marks
    };
};
