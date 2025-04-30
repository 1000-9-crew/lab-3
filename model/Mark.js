class Mark {
    id;
    lessonId;
    studentId;
    mark;
    attendance;

    constructor(id, lessonId, studentId, mark = null, attendance) {
        this.id = id;
        this.lessonId = lessonId;
        this.studentId = studentId;
        this.mark = mark;
        this.attendance = attendance;
    }

    static fromJson(json) {
        return new Mark(
            json.id,
            json.lessonId,
            json.studentId,
            json.mark,
            json.attendance
        );
    }
}

class LessonMark {
    lesson; // Lesson object
    mark; // Array of MarkDetails objects

    constructor(lesson, mark) {
        this.lesson = lesson;
        this.mark = mark;
    }
}

class MarkDetails {
    mark;
    attendance;

    constructor(mark = null, attendance) {
        this.mark = mark;
        this.attendance = attendance;
    }
}

class StudentMark {
    constructor(id, student, mark = null, attendance) {
        this.id = id;
        this.student = student; // Student object
        this.mark = mark;
        this.attendance = attendance;
    }
}

class MarkCreateDTO {
    mark;
    attendance;

    constructor(mark, attendance) {
        this.mark = mark;
        this.attendance = attendance;
    }
}

class MarkUpdateDTO {
    mark;
    attendance;

    constructor(mark, attendance) {
        this.mark = mark;
        this.attendance = attendance;
    }
}

module.exports = { Mark, LessonMark, MarkDetails, StudentMark, MarkCreateDTO, MarkUpdateDTO };
