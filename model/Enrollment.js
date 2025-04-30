class Enrollment {
    subjectId;
    studentId;

    constructor(subjectId, studentId) {
        this.subjectId = subjectId;
        this.studentId = studentId;
    }

    static fromJson(json) {
        return new Enrollment(json.subjectId, json.studentId);
    }
}

module.exports = { Enrollment };