const constants = require("../../config/constants");
const { sendResponse, generateAuthToken } = require("../../utils/comman.service");
const { addUserService, getUsersCountService, getUsersService, getUserByIdService, updateUserService, deleteUserService, getUsersDetailService, updateAllUserService, bulkWriteUsersService } = require("../services/user.services");
const bcrypt = require("bcryptjs");

const addUser = async (req, res) => {
  try {
    let reqBody = req.body
    const isUserExist = await getUsersCountService({ email: reqBody.email })
    if (isUserExist > 0) {
      return sendResponse(
        req,
        res,
        constants.WEB_STATUS_CODE.OK,
        constants.STATUS_CODE.SUCCESS,
        "User already exist with provided email.",
        null,
      );
    }
    reqBody.password = await bcrypt.hash(reqBody.password, 10);
    const createdUser = await addUserService(reqBody)
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.OK,
      constants.STATUS_CODE.SUCCESS,
      "User created successfully.",
      createdUser,
    );
  } catch (err) {
    console.log("Error(create User)..", err);
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.SERVER_ERROR,
      constants.STATUS_CODE.FAIL,
      "Something went wrong. Please try again later.",
      { message: err?.message },
    );
  }
};
const getUserList = async (req, res) => {
  try {
    let { page, pageSize, sortBy, sortOrder, search, is_active } = req.query;
    page = page ?? constants.PAGINATION.DEFAULT_PAGE;
    pageSize = pageSize ?? constants.PAGINATION.DEFAULT_PAGESIZE;
    sortBy = sortBy ?? constants.PAGINATION.DEFAULT_SORTBY;
    sortOrder = sortOrder ?? constants.PAGINATION.DEFAULT_SORTORDER;
    const offset = (page - 1) * pageSize;
    let limit = parseInt(pageSize);
    let whereClause = {}
    const order = { [sortBy]: sortOrder == "ASC" ? 1 : -1 };
    // if (search) whereClause.first_name = { [Op.iLike]: `%${search}%` };
    if (search) {
      whereClause.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (is_active) whereClause.is_active = is_active;
    let [usersData, usersCount] = await Promise.all([
      getUsersService(
        whereClause,
        order,
        offset,
        limit
      ),
      getUsersCountService(whereClause),
    ]);
    let data = {
      data: usersData,
      pageSize: pageSize,
      page: page,
      total: usersCount,
    };
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.OK,
      constants.STATUS_CODE.SUCCESS,
      "User List get successfully.",
      data,
    );
  } catch (err) {
    console.log("Error(get list user)..", err);
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.SERVER_ERROR,
      constants.STATUS_CODE.FAIL,
      "Something went wrong. Please try again later.",
      { message: err?.message },
    );
  }
};
const getUserById = async (req, res) => {
  try {
    const userDetail = await getUserByIdService(req.params.userId)
    if (!userDetail) {
      return sendResponse(
        req,
        res,
        constants.WEB_STATUS_CODE.BAD_REQUEST,
        constants.STATUS_CODE.SUCCESS,
        "User doen't found.",
        null,
      );
    }
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.OK,
      constants.STATUS_CODE.SUCCESS,
      "User details fetched successfully.",
      userDetail,
    );
  } catch (err) {
    console.log("Error(user get bu id)..", err);
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.SERVER_ERROR,
      constants.STATUS_CODE.FAIL,
      "Something went wrong. Please try again later.",
      { message: err?.message },
    );
  }
};
const updateUser = async (req, res) => {
  try {
    if (req.body.email) {
      const isEmailAlreayExisted = await getUsersDetailService({ _id: { $ne: req.params.userId }, email: req.body.email })
      if (isEmailAlreayExisted) {
        return sendResponse(
          req,
          res,
          constants.WEB_STATUS_CODE.BAD_REQUEST,
          constants.STATUS_CODE.SUCCESS,
          "User email already existed.",
          null,
        );
      }
    }
    const userDetail = await updateUserService(req.params.userId, req.body)
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.OK,
      constants.STATUS_CODE.SUCCESS,
      "User updated successfully.",
      userDetail,
    );
  } catch (err) {
    console.log("Error(update user)..", err);
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.SERVER_ERROR,
      constants.STATUS_CODE.FAIL,
      "Something went wrong. Please try again later.",
      { message: err?.message },
    );
  }
};
const deleteUser = async (req, res) => {
  try {
    const userDetail = await deleteUserService(req.params.userId)

    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.OK,
      constants.STATUS_CODE.SUCCESS,
      "User deleted successfully.", +
    userDetail,
    );
  } catch (err) {
    console.log("Error(update user)..", err);
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.SERVER_ERROR,
      constants.STATUS_CODE.FAIL,
      "Something went wrong. Please try again later.",
      { message: err?.message },
    );
  }
};

const userSignIn = async (req, res) => {
  try {
    const userDetail = await getUsersDetailService({ email: req.body.email })
    if (!userDetail) {
      return sendResponse(
        req,
        res,
        constants.WEB_STATUS_CODE.BAD_REQUEST,
        constants.STATUS_CODE.SUCCESS,
        "User not found with provided email.",
        {},
      );
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      userDetail.password
    );
    if (!isPasswordValid) {
      return sendResponse(
        req,
        res,
        constants.WEB_STATUS_CODE.BAD_REQUEST,
        constants.STATUS_CODE.BAD_REQUEST,
        "User password is incorrect.",
        {},
      );
    }
    const jwtToken = await generateAuthToken(userDetail);

    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.OK,
      constants.STATUS_CODE.SUCCESS,
      "User signin sucessfully.",
      { jwtToken, ...userDetail },
    );
  } catch (err) {
    console.log("Error(update user)..", err);
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.SERVER_ERROR,
      constants.STATUS_CODE.FAIL,
      "Something went wrong. Please try again later.",
      { message: err?.message },
    );
  }
};
const updateBulkUsers = async (req, res) => {
  try {
    let result
    if (req.body.all_user) {
      result = await updateAllUserService(req.body)
    } else {
      const bulkData = req.body.users_data.map(data => ({
        updateOne: {
          filter: { _id: data.id },
          update: { $set: data }
        }
      }));
      result = await bulkWriteUsersService(bulkData)
    }
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.OK,
      constants.STATUS_CODE.SUCCESS,
      "User data updated successfully.",
      result,
    );
  } catch (err) {
    console.log("Error(update user)..", err);
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.SERVER_ERROR,
      constants.STATUS_CODE.FAIL,
      "Something went wrong. Please try again later.",
      { message: err?.message },
    );
  }
};
const checkUserAccessModule = async (req, res) => {
  try {

    const userDetail = await getUserByIdService(req.params.userId)
    if (!userDetail) {
      return sendResponse(
        req,
        res,
        constants.WEB_STATUS_CODE.BAD_REQUEST,
        constants.STATUS_CODE.SUCCESS,
        "User doen't found.",
        null,
      );
    }
    if (!userDetail.role_id.modules.includes(req.query.module)) {
      return sendResponse(
        req,
        res,
        constants.WEB_STATUS_CODE.BAD_REQUEST,
        constants.STATUS_CODE.SUCCESS,
        "User doen't have access to the provided module.",
        null,
      );
    }
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.OK,
      constants.STATUS_CODE.SUCCESS,
      "User does have access to the provided module.",
      {},
    );
  } catch (err) {
    console.log("Error(user get bu id)..", err);
    return sendResponse(
      req,
      res,
      constants.WEB_STATUS_CODE.SERVER_ERROR,
      constants.STATUS_CODE.FAIL,
      "Something went wrong. Please try again later.",
      { message: err?.message },
    );
  }
};

module.exports = {
  addUser,
  getUserList,
  getUserById,
  updateUser,
  deleteUser,
  userSignIn,
  updateBulkUsers,
  checkUserAccessModule
}
