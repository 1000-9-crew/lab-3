const { readJson, writeJson } = require("./jsonReader");
const { Mark, LessonMark, MarkDetails, StudentMark } = require("../model/Mark");
const { Subject } = require("../model/Subject");
const { Lesson } = require("../model/Lesson");
const userRepository = require("./userRepository");
const { Student } = require("../model/User");
const { Enrollment } = require("../model/Enrollment");

exports.findSubjectsbyStudentId = async (studentId) => {
    const enrollments = await readJson("enrollments.json");
    const subjects = await readJson("subjects.json");

    const studentSubjects = subjects.filter(subject =>
        enrollments.some(enrollment => enrollment.studentId === studentId && enrollment.subjectId === subject.id)
    );

    return studentSubjects ? studentSubjects.map(subject => Subject.fromJson(subject)) : null;
};

exports.findSubjectsByTeacherId = async (teacherId) => {
    const subjects = await readJson("subjects.json");
    const teacherSubjects = subjects.filter(subject => subject.teacherId === teacherId);

    return teacherSubjects.map(subject => Subject.fromJson(subject));
};

exports.findSubjectById = async (subjectId) => {
    const subjects = await readJson("subjects.json");
    const subject = subjects.find(subject => subject.id === subjectId);

    return subject ? Subject.fromJson(subject) : null;
};

exports.findLessonById = async (lessonId) => {
    const lessons = await readJson("lessons.json");
    const lesson = lessons.find(lesson => lesson.id === lessonId);

    return lesson ? Lesson.fromJson(lesson) : null;
};

exports.findLessonsBySubjectId = async (subjectId) => {
    const lessons = await readJson("lessons.json");
    const subjectLessons = lessons.filter(lesson => lesson.subjectId === subjectId);

    return subjectLessons.map(lesson => Lesson.fromJson(lesson));
};

exports.findMarksByStudentIdAndSubjectId = async (studentId, subjectId) => {
    const lessons = await readJson("lessons.json");
    const marks = await readJson("marks.json");

    const subjectLessons = lessons.filter(lesson => lesson.subjectId === subjectId);
    const lessonIds = subjectLessons.map(lesson => lesson.id);

    const subjectMarks = marks.filter(mark => mark.studentId === studentId && lessonIds.includes(mark.lessonId));
    const resolvedMarks = subjectMarks.map(mark => {
        const lesson = subjectLessons.find(lesson => lesson.id === mark.lessonId);
        return new LessonMark(
            Lesson.fromJson(lesson),
            new MarkDetails(mark.mark, mark.attendance)
        );
    });

    return resolvedMarks;
};

exports.findEnrolledStudentsBySubjectId = async (subjectId) => {
    const enrollments = await readJson("enrollments.json");
    const students = await userRepository.findAllStudents();

    const subjectEnrollments = enrollments.filter(enrollment => enrollment.subjectId === subjectId);
    const studentIds = subjectEnrollments.map(enrollment => enrollment.studentId);
    const enrolledStudents = students.filter(student => studentIds.includes(student.id));

    return enrolledStudents.map(student => new Student(student.id, student.name));
};

exports.findUnEnrolledStudentsBySubjectId = async (subjectId) => {
    const enrollments = await readJson("enrollments.json");
    const students = await userRepository.findAllStudents();

    const subjectEnrollments = enrollments.filter(enrollment => enrollment.subjectId === subjectId);
    const studentIds = subjectEnrollments.map(enrollment => enrollment.studentId);
    const unEnrolledStudents = students.filter(student => !studentIds.includes(student.id));

    return unEnrolledStudents.map(student => new Student(student.id, student.name));
};

exports.findMarksWithStudentByLessonId = async (lessonId) => {
    const marks = await readJson("marks.json");
    const students = await userRepository.findAllStudents();

    const lessonMarks = marks.filter(mark => mark.lessonId === lessonId);
    const resolvedMarks = lessonMarks.map(mark => {
        const student = students.find(student => student.id === mark.studentId);
        return new StudentMark(
            mark.id,
            new Student(student.id, student.name),
            mark.mark,
            mark.attendance
        );
    });

    return resolvedMarks;
};

exports.insertSubject = async (subject) => {
    const subjects = await readJson("subjects.json");
    const newSubject = new Subject(
        Date.now(),
        subject.teacherId,
        subject.name,
    );
    subjects.push(newSubject);
    await writeJson("subjects.json", subjects);
    return newSubject;
};

exports.insertLesson = async (lesson) => {
    const lessons = await readJson("lessons.json");
    const newLesson = new Lesson(
        Date.now(),
        lesson.subjectId,
        lesson.name,
        lesson.date,
    );
    lessons.push(newLesson);
    await writeJson("lessons.json", lessons);
    return newLesson;
};

exports.removeLessonById = async (lessonId) => {
    const lessons = await readJson("lessons.json");
    const marks = await readJson("marks.json");

    const lessonIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex === -1) return null;

    lessons.splice(lessonIndex, 1);
    await writeJson("lessons.json", lessons);

    const lessonMarks = marks.filter(mark => mark.lessonId === lessonId);
    const newMarks = marks.filter(mark => !lessonMarks.includes(mark));
    await writeJson("marks.json", newMarks);

    return true;
};

exports.insertMark = async (mark) => {
    const marks = await readJson("marks.json");
    const newMark = new Mark(
        Date.now(),
        mark.lessonId,
        mark.studentId,
        mark.mark,
        mark.attendance,
    );
    marks.push(newMark);
    await writeJson("marks.json", marks);
    return newMark;
};

exports.findMarkById = async (markId) => {
    const marks = await readJson("marks.json");
    const mark = marks.find(mark => mark.id === markId);
    return mark ? Mark.fromJson(mark) : null;
};

exports.removeMarkById = async (markId) => {
    const marks = await readJson("marks.json");

    const markIndex = marks.findIndex(mark => mark.id === markId);
    if (markIndex === -1) return null;

    marks.splice(markIndex, 1);
    await writeJson("marks.json", marks);

    return true;
};

exports.updateMarkById = async (markId, newMark) => {
    const marks = await readJson("marks.json");

    const markIndex = marks.findIndex(mark => mark.id === markId);
    if (markIndex === -1) return null;

    const mark = marks[markIndex];
    mark.lessonId = newMark.lessonId;
    mark.studentId = newMark.studentId;
    mark.mark = newMark.mark;
    mark.attendance = newMark.attendance;

    await writeJson("marks.json", marks);

    return mark;
};

exports.insertEnrollment = async (enrollment) => {
    const enrollments = await readJson("enrollments.json");

    enrollments.push(enrollment);
    await writeJson("enrollments.json", enrollments);

    return enrollment;
};

exports.removeEnrollmentBySubjectIdAndStudentId = async (subjectId, studentId) => {
    const enrollments = await readJson("enrollments.json");

    const enrollmentIndex = enrollments.findIndex(enrollment => enrollment.subjectId === subjectId && enrollment.studentId === studentId);
    if (enrollmentIndex === -1) return null;

    enrollments.splice(enrollmentIndex, 1);
    await writeJson("enrollments.json", enrollments);

    return true;
}

exports.findEnrollmentBySubjectIdAndStudentId = async (subjectId, studentId) => {
    const enrollments = await readJson("enrollments.json");
    const enrollment = enrollments.find(enrollment => enrollment.subjectId === subjectId && enrollment.studentId === studentId);
    return enrollment ? Enrollment.fromJson(enrollment) : null;
}