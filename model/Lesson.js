class Lesson {
    id;
    subjectId;
    name;
    date;

    constructor(id, subjectId, name, date) {
        this.id = id;
        this.subjectId = subjectId;
        this.name = name;
        this.date = date;
    }

    static fromJson(json) {
        return new Lesson(json.id, json.subjectId, json.name, json.date);
    }
}

class LessonCreateDTO {
    name;
    date;

    constructor(name, date) {
        this.name = name;
        this.date = date;
    }
}

module.exports = { Lesson, LessonCreateDTO };