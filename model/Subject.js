class Subject {
    id;
    teacherId;
    name;

    constructor(id, teacherId, name) {
        this.id = id;
        this.teacherId = teacherId;
        this.name = name;
    }

    static fromJson(json) {
        return new Subject(json.id, json.teacherId, json.name);
    }
}

class SubjectCreateDTO {
    name;

    constructor(name) {
        this.name = name;
    }
}



class SubjectWithTeacher {
    id;
    teacherId;
    name;
    teacherName;

    constructor(id, teacherId, name, teacherName) {
        this.id = id;
        this.teacherId = teacherId;
        this.name = name;
        this.teacherName = teacherName;
    }
}

module.exports = { Subject, SubjectWithTeacher, SubjectCreateDTO };