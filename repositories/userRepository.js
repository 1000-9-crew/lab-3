const { readJson, writeJson } = require("./jsonReader");
const { User, Student, Teacher } = require("../model/User");

exports.findByLogin = async (login) => {
    const users = await readJson("users.json");
    const userData = users.find(user => user.login === login) || null;
    return userData ? User.fromJson(userData) : null;
};

exports.findById = async (id) => {
    const users = await readJson("users.json");
    const userData = users.find(user => user.id === id) || null;
    return userData ? User.fromJson(userData) : null;
};

exports.insert = async (userCreateDTO) => {
    const users = await readJson("users.json");
    const newUser = new User(
        Date.now(),
        userCreateDTO.name,
        userCreateDTO.login,
        userCreateDTO.password,
        userCreateDTO.role
    );
    users.push(newUser);
    await writeJson("users.json", users);
    return newUser;
};

exports.findAllStudents = async () => {
    const users = await readJson("users.json");
    const students = users.filter(user => user.role === "student");

    return students.map(student => Student.fromJson(student));
};

exports.findAllTeachers = async () => {
    const users = await readJson("users.json");
    const teachers = users.filter(user => user.role === "teacher");

    return teachers.map(teacher => Teacher.fromJson(teacher));
}

exports.findStudentById = async (studentId) => {
    const users = await readJson("users.json");
    const student = users.find(user => user.id === studentId && user.role === "student");

    return student ? Student.fromJson(student) : null;
};