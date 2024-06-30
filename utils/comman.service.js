const { validationResult } = require("express-validator");
const constants = require("../config/constants");
const jwt = require("jsonwebtoken");
const { getUsersDetailService } = require("../src/services/user.services");

const sendResponse = async (
    req,
    res,
    statusCode,
    status,
    message,
    data,
) => {
    try {
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.write(
            JSON.stringify({
                status: status,
                message: message,
                data: statusCode === 500 ? data.message : data,
            })
        );
        res.end();
    } catch (err) {
        console.log("Error(sendResponse): ", err);
        throw err;
    }
};
const sendResponseValidation = async (
    req,
    res,
    statusCode,
    status,
    message,
    data,
) => {
    try {
        res.writeHead(statusCode, { "Content-Type": "application/json" });
        res.write(
            JSON.stringify({
                status: status,
                message: message,
                data: data,
            })
        );
        res.end();
    } catch (err) {
        console.log("Error(sendResponseValidation): ", err);
        throw err;
    }
};
const validatorFunc = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponseValidation(
            req,
            res,
            constants.WEB_STATUS_CODE.BAD_REQUEST,
            constants.STATUS_CODE.VALIDATION,
            errors.array()[0].msg,
            {},
        );
    }
    next();
};
const generateAuthToken = async (payLoad) => {
    const token = jwt.sign(
        {
            _id: payLoad._id,
            email: payLoad.email,
            first_name: payLoad.first_name,
            last_name: payLoad.last_name
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
    return token;
};
let authenticate = async (req, res, next) => {
    try {
        if (!req.header("Authorization") || !req.header("Authorization"))
            return sendResponse(
                req,
                res,
                constants.WEB_STATUS_CODE.UNAUTHORIZED,
                constants.STATUS_CODE.UNAUTHENTICATED,
                "Unauthorized, please login.",
                null,
            );
        const token = req
            .header("Authorization")
            ?.toString()
            .replace("Bearer ", "");
        if (!token)
            sendResponse(
                req,
                res,
                constants.WEB_STATUS_CODE.BAD_REQUEST,
                constants.STATUS_CODE.FAIL,
                "Token not found.",
            );

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await getUsersDetailService({
            email: decoded.email,
        });
        if (!user)
            return sendResponse(
                res,
                constants.WEB_STATUS_CODE.UNAUTHORIZED,
                constants.STATUS_CODE.UNAUTHENTICATED,
                "Unauthorized, please login.",
                null,
            );
        req.user = user;
        next();
    } catch (err) {
        console.log("Error(authenticate): ", err);

        if (err.message == constants.JWT_EXPIRED_MESSAGE) {
            return sendResponse(
                res,
                constants.WEB_STATUS_CODE.UNAUTHORIZED,
                constants.STATUS_CODE.UNAUTHENTICATED,
                "JWT is expired, Please login again.",
                null,
            );
        }
        return sendResponse(
            req,
            res,
            constants.WEB_STATUS_CODE.SERVER_ERROR,
            constants.STATUS_CODE.FAIL,
            "Something went wrong. Please try again later.",
            err,
        );
    }
};
module.exports = {
    sendResponse,
    validatorFunc,
    generateAuthToken,
    authenticate
}