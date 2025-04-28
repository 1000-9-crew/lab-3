const { body, param, validationResult, matchedData } = require("express-validator");

const validateLogin = [
    body("login")
        .trim()
        .notEmpty().withMessage("Login is required")
        .isAscii().withMessage("Login must be ASCII"),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isAscii().withMessage("Password must be ASCII")
        .isLength({ min: 2 }).withMessage("Password must be at least 2 characters long"),
];

const validateRegister = [
    ...validateLogin,

    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isAscii().withMessage("Name must be ASCII"),

    body("role")
        .isIn(['teacher', 'student']).withMessage('Role must be either "teacher" or "student"'),
];

const validateParamsAsInt = (params) => {
    return params.map((paramName) =>
        param(paramName)
            .isInt().withMessage(`${paramName} must be an integer`)
            .toInt()
    );
};

const validateIds = (fieldNames) => {
    return fieldNames.map((fieldName) =>
        body(fieldName)
            .isInt().withMessage(`${fieldName} must be an integer`)
            .toInt()
    );
};

const validateId = (fieldName) => {
    return body(fieldName)
        .isInt().withMessage(`${fieldName} must be an integer`)
        .toInt();
};

const formValidators = {
    subjectName: body("name")
        .trim()
        .notEmpty().withMessage("Name is required"),

    lessonDate: body("date")
        .notEmpty().withMessage("Date is required")
        .isDate({ format: "YYYY-MM-DD", strictMode: true }).withMessage("Date must be a valid date in the format YYYY-MM-DD")
    , //.toDate()

    lessonName: body("name")
        .trim()
        .notEmpty().withMessage("Name is required"),

    Id: body("id")
        .isInt().withMessage("Ids must be an integers")
        .toInt(),

    mark: body("mark")
        .optional({ checkFalsy: true })
        .isInt({ min: 0, max: 100 }).withMessage("Mark must be an integer between 0 and 100")
        .toInt()
        .default(null),

    attendance: body("attendance")
        .customSanitizer(value => value === "on" ? true : false),
        //.toBoolean(),
};

const validateCreateSubject = [
    formValidators.subjectName,
];

const validateCreateLesson = [
    formValidators.lessonName,
    formValidators.lessonDate,
];

const validateCreateMark = [
    validateId("studentId"),
    formValidators.mark,
    formValidators.attendance,
];

const validateEditMark = [
    formValidators.mark,
    formValidators.attendance,
];

const validateEnrollment = [
    validateId("studentId"),
    validateId("subjectId"),
];


const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        req.matchedData = matchedData(req);
        return next();
    }

    const errorMessages = errors.array().map(err => err.msg); // Extract error messages

    return res.status(400).render('error', {
        message: "Validation Error",
        error: { stack: errorMessages.join("\n") }
    });
};

module.exports = {
    validateLogin,
    validateRegister,
    validateCreateSubject,
    validateCreateLesson,
    validateCreateMark,
    validateEditMark,
    validateEnrollment,
    handleValidationErrors,
};