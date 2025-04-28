const { readJson, writeJson } = require("./jsonReader");

exports.findAllStudents = async () => {
    const users = await readJson("users.json");
    const students = users.filter(user => user.role === "student");

    return students.map(student => {
        return {
            id: student.id,
            name: student.name,
        };
    });
};

exports.findStudentById = async (studentId) => {
    const users = await readJson("users.json");
    const student = users.find(user => user.id === studentId && user.role === "student");
    if (!student) return null;

    return student;
};

exports.findAllTeachers = async () => {
    const users = await readJson("users.json");
    const teachers = users.filter(user => user.role === "teacher");

    return teachers.map(teacher => {
        return {
            id: teacher.id,
            name: teacher.name,
        };
    });
}

exports.findSubjectsbyStudentId = async (studentId) => {
    const enrollments = await readJson("enrollments.json");
    const subjects = await readJson("subjects.json");

    const studentEnrollments = enrollments.filter(enrollment => enrollment.studentId === studentId);
    const subjectIds = studentEnrollments.map(enrollment => enrollment.subjectId);
    const studentSubjects = subjects.filter(subject => subjectIds.includes(subject.id));

    return studentSubjects;
};

exports.findSubjectsByTeacherId = async (teacherId) => {
    const subjects = await readJson("subjects.json");

    const teacherSubjects = subjects.filter(subject => subject.teacherId === teacherId);
    return teacherSubjects;
};

exports.findSubjectById = async (subjectId) => {
    const subjects = await readJson("subjects.json");

    const subject = subjects.find(subject => subject.id === subjectId);
    if (!subject) return null;

    return subject;
};

exports.findLessonById = async (lessonId) => {
    const lessons = await readJson("lessons.json");

    const lesson = lessons.find(lesson => lesson.id === lessonId);
    if (!lesson) return null;

    return lesson;
};

exports.findLessonsBySubjectId = async (subjectId) => {
    const lessons = await readJson("lessons.json");

    const subjectLessons = lessons.filter(lesson => lesson.subjectId === subjectId);
    return subjectLessons;
};

exports.findMarksByStudentIdAndSubjectId = async (studentId, subjectId) => {
    const lessons = await readJson("lessons.json");
    const marks = await readJson("marks.json");

    const subjectLessons = lessons.filter(lesson => lesson.subjectId === subjectId);
    const lessonIds = subjectLessons.map(lesson => lesson.id);

    const subjectMarks = marks.filter(mark => mark.studentId === studentId && lessonIds.includes(mark.lessonId));
    const resolvedMarks = subjectMarks.map(mark => {
        const lesson = subjectLessons.find(lesson => lesson.id === mark.lessonId);
        return {
            date: lesson.date,
            name: lesson.name,
            marks: [
                {
                    mark: mark.mark,
                    attendance: mark.attendance,
                }
            ],
        };
    });

    return resolvedMarks;
};

exports.findEnrolledStudentsBySubjectId = async (subjectId) => {
    const enrollments = await readJson("enrollments.json");
    const students = await this.findAllStudents();

    const subjectEnrollments = enrollments.filter(enrollment => enrollment.subjectId === subjectId);
    const studentIds = subjectEnrollments.map(enrollment => enrollment.studentId);
    const enrolledStudents = students.filter(student => studentIds.includes(student.id));

    return enrolledStudents.map(student => {
        return {
            id: student.id,
            name: student.name,
        };
    });
};

exports.findUnEnrolledStudentsBySubjectId = async (subjectId) => {
    const enrollments = await readJson("enrollments.json");
    const students = await this.findAllStudents();

    const subjectEnrollments = enrollments.filter(enrollment => enrollment.subjectId === subjectId);
    const studentIds = subjectEnrollments.map(enrollment => enrollment.studentId);
    const unEnrolledStudents = students.filter(student => !studentIds.includes(student.id));

    return unEnrolledStudents.map(student => {
        return {
            id: student.id,
            name: student.name,
        };
    });
};

exports.findMarksWithStudentByLessonId = async (lessonId) => {
    const marks = await readJson("marks.json");
    const students = await this.findAllStudents();

    const lessonMarks = marks.filter(mark => mark.lessonId === lessonId);
    const resolvedMarks = lessonMarks.map(mark => {
        const student = students.find(student => student.id === mark.studentId);
        return {
            id: mark.id,
            student: {
                id: student.id,
                name: student.name,
            },
            mark: mark.mark,
            attendance: mark.attendance,
        };
    });

    return resolvedMarks;
};

exports.insertSubject = async (subject) => {
    const subjects = await readJson("subjects.json");

    const newSubject = {
        id: Date.now(),
        ...subject,
    };

    subjects.push(newSubject);
    await writeJson("subjects.json", subjects);

    return newSubject;
};

exports.insertLesson = async (lesson) => {
    const lessons = await readJson("lessons.json");

    const newLesson = {
        id: Date.now(),
        ...lesson,
    };

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

    const newMark = {
        id: Date.now(),
        ...mark,
    };

    marks.push(newMark);
    await writeJson("marks.json", marks);

    return newMark;
};

exports.findMarkById = async (markId) => {
    const marks = await readJson("marks.json");

    const mark = marks.find(mark => mark.id === markId);
    if (!mark) return null;

    return mark;
};

exports.removeMarkById = async (markId) => {
    const marks = await readJson("marks.json");

    const markIndex = marks.findIndex(mark => mark.id === markId);
    if (markIndex === -1) return null;

    marks.splice(markIndex, 1);
    await writeJson("marks.json", marks);

    return true;
};

exports.updateMarkById = async (markId, mark) => {
    const marks = await readJson("marks.json");

    const markIndex = marks.findIndex(mark => mark.id === markId);
    if (markIndex === -1) return null;

    marks[markIndex] = {
        ...marks[markIndex],
        ...mark,
    };

    await writeJson("marks.json", marks);

    return marks[markIndex];
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
    if (!enrollment) return null;

    return enrollment;
}