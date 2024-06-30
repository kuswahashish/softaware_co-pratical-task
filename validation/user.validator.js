const { body } = require('express-validator');

//validate user form detail
exports.addUserValidator = [
    body('first_name')
        .not()
        .isEmpty()
        .withMessage("first name is required."),
    body('last_name')
        .not()
        .isEmpty()
        .withMessage("last name is required."),
    body('email')
        .not()
        .isEmpty()
        .withMessage("email is required."),
    body('role_id')
        .not()
        .isEmpty()
        .withMessage("user role is required."),

];