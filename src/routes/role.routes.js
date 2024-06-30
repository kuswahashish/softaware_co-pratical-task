const router = require('express').Router();
const { addRole, getRoleList, getRoleById, updateRole, deleteRole } = require('../controllers/role.controller');
const { validatorFunc } = require('../../utils/comman.service');
const { addRoleValidator } = require('../../validation/role.validator');

// Role routes
router.post('/', addRoleValidator, validatorFunc, addRole);
router.get('/', getRoleList);
router.get('/:roleId', getRoleById);
router.put('/:roleId', updateRole);
router.delete('/:roleId', deleteRole);

module.exports = router;
