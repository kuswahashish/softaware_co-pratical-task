const { body } = require('express-validator');

//validate user form detail
exports.addRoleValidator = [
    body('role_name')
        .not()
        .isEmpty()
        .withMessage("Role name is required."),
];