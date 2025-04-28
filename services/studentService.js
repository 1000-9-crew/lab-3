const journalRepository = require("../repositories/journalRepository");
const createError = require('http-errors');

exports.getSubjects = async (studentId) => {
    subjects = await journalRepository.findSubjectsbyStudentId(studentId);
    return subjects.map(subject => {
        return {
            id: subject.id,
            name: subject.name,
        };
    });
};

exports.getSubjectJournal = async (studentId, subjectId) => {
    const subject = await journalRepository.findSubjectById(subjectId);
    if (!subject) throw createError(404, "Subject not found");

    // find marks by studentId and subjectId with JOIN lesson name and date
    const marks = await journalRepository.findMarksByStudentIdAndSubjectId(studentId, subjectId);

    return {
        subject: {id: subject.id, name: subject.name},
        marks: marks
    };
    // marks: [
    //     {
    //         date: "2025-03-28",
    //         name: "swagg is:",
    //         marks: [
    //             {
    //                 mark: 80,
    //                 attendance: true,
    //             },
    //         ],
    //     },
    //     {
    //         date: "2025-03-29",
    //         name: "swagg is: 2",
    //         marks: [
    //         ],
    //     },
    // ]
};
