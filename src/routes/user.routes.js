const router = require('express').Router();
const { validatorFunc, authenticate } = require('../../utils/comman.service');
const { addUserValidator } = require('../../validation/user.validator');
const { addUser, getUserList, getUserById, updateUser, deleteUser, userSignIn, updateBulkUsers, checkUserAccessModule } = require('../controllers/user.controller');

// User routes

router.post('/', addUserValidator, validatorFunc, addUser);
router.post('/sign-in', userSignIn);
router.get('/', getUserList);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);
router.put('/bulk-update', updateBulkUsers);
router.get('/check-access-module/:userId', checkUserAccessModule);
module.exports = router;