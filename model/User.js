class User {
    id;
    name;
    login;
    password;
    role;

    constructor(id, name, login, password, role) {
        this.id = id;
        this.name = name;
        this.login = login;
        this.password = password;
        this.role = role;
    }

    static fromJson(userData) {
        return new User(userData.id, userData.name, userData.login, userData.password, userData.role);
    }

    isStudent() {
        return this.role === 'student';
    }

    isTeacher() {
        return this.role === 'teacher';
    }
}

class UserProfile {
    id;
    name;
    role;

    constructor(id, name, role) {
        this.id = id;
        this.name = name;
        this.role = role;
    }

    static fromUser(user) {
        return new UserProfile(user.id, user.name, user.role);
    }

    isStudent() {
        return this.role === 'student';
    }

    isTeacher() {
        return this.role === 'teacher';
    }
}

class Student {
    id;
    name;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static fromJson(json) {
        return new Student(json.id, json.name);
    }

    static fromUser(user) {
        if (!user.isStudent()) {
            throw new Error("User is not a student");
        }
        return new Student(user.id, user.name);
    }

    static fromUserProfile(userProfile) {
        if (!userProfile.isStudent()) {
            throw new Error("User profile is not a student");
        }
        return new Student(userProfile.id, userProfile.name);
    }
}

class Teacher {
    id;
    name;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static fromJson(json) {
        return new Teacher(json.id, json.name);
    }

    static fromUser(user) {
        if (!user.isTeacher()) {
            throw new Error("User is not a student");
        }
        return new Teacher(user.id, user.name);
    }

    static fromUserProfile(userProfile) {
        if (!userProfile.isTeacher()) {
            throw new Error("User profile is not a student");
        }
        return new Teacher(userProfile.id, userProfile.name);
    }
}

class UserCreateDTO {
    name;
    login;
    password;
    role;

    constructor(name, login, password, role) {
        this.name = name;
        this.login = login;
        this.password = password;
        this.role = role;
    }
}

class UserAuthDTO {
    login;
    password;

    constructor(login, password) {
        this.login = login;
        this.password = password;
    }
}

module.exports = { User, UserProfile, UserCreateDTO, UserAuthDTO, Student, Teacher };