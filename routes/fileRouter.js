const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require('fs');

const filePath = (filename) => path.join(__dirname, '../data', filename);

router.get("/sync", (req, res, next) => {
    try {
        const data = fs.readFileSync(filePath("users.json"), 'utf8');
        res.render("demo", { method: "sync", file: JSON.parse(data) });
    } catch (err) {
        next(err);
    }
});

router.get("/callback", (req, res, next) => {
    fs.readFile(filePath("subjects.json"), 'utf8', (err, data) => {
        if (err) return next(err);
        res.render("demo", { method: "callback", file: JSON.parse(data) });
    });
});

router.get("/promise", (req, res, next) => {
    fs.promises.readFile(filePath("lessons.json"), 'utf8')
        .then(data => res.render("demo", { method: "promise", file: JSON.parse(data) }))
        .catch(err => next(err));
});

router.get("/async", async (req, res, next) => {
    try {
        const data = await fs.promises.readFile(filePath("enrollment.json"), 'utf8');
        res.render("demo", { method: "async", file: JSON.parse(data) });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
