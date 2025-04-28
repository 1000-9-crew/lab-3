const {readJson, writeJson} = require("./jsonReader");


exports.findByLogin = async (login) => {
    const users = await readJson("users.json");
    return users.find(user => user.login === login) || null;
};

exports.findById = async (id) => {
    const users = await readJson("users.json");
    return users.find(user => user.id === id) || null;
};

exports.insert = async (name, login, password, role) => {
    const users = await readJson("users.json");
    const newUser = {
        id: Date.now(),
        name,
        login,
        password,
        role
    };
    users.push(newUser);
    await writeJson("users.json", users);
    return newUser;
};