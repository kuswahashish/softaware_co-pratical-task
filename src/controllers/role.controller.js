const constants = require("../../config/constants");
const { sendResponse } = require("../../utils/comman.service");
const { addRoleService, getRolesCount, getRolesService, getRoleByIdService, updateRoleService, deleteRoleService } = require("../services/role.services");

const addRole = async (req, res) => {
    try {
        const isRoleExist = await getRolesCount({ role_name: req.body.role_name })
        if (isRoleExist > 0) {
            return sendResponse(
                req,
                res,
                constants.WEB_STATUS_CODE.OK,
                constants.STATUS_CODE.SUCCESS,
                "Role already exist.",
                null,
            );
        }
        const createdRole = await addRoleService(req.body)
        return sendResponse(
            req,
            res,
            constants.WEB_STATUS_CODE.OK,
            constants.STATUS_CODE.SUCCESS,
            "Role created successfully.",
            createdRole,
        );
    } catch (err) {
        console.log("Error(create role)..", err);
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
const getRoleList = async (req, res) => {
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
        if (search) whereClause.role_name = { $regex: search, $options: 'i' };
        if (is_active) whereClause.is_active = is_active;
        let [rolesData, rolesCount] = await Promise.all([
            getRolesService(
                whereClause,
                order,
                offset,
                limit
            ),
            getRolesCount(whereClause),
        ]);
        let data = {
            data: rolesData,
            pageSize: pageSize,
            page: page,
            total: rolesCount,
        };
        return sendResponse(
            req,
            res,
            constants.WEB_STATUS_CODE.OK,
            constants.STATUS_CODE.SUCCESS,
            "Role List get successfully.",
            data,
        );
    } catch (err) {
        console.log("Error(get list role)..", err);
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
const getRoleById = async (req, res) => {
    try {
        const roleDetail = await getRoleByIdService(req.params.roleId)
        if (!roleDetail) {
            return sendResponse(
                req,
                res,
                constants.WEB_STATUS_CODE.BAD_REQUEST,
                constants.STATUS_CODE.SUCCESS,
                "Role doen't found.",
                null,
            );
        }
        return sendResponse(
            req,
            res,
            constants.WEB_STATUS_CODE.OK,
            constants.STATUS_CODE.SUCCESS,
            "Role details fetched successfully.",
            roleDetail,
        );
    } catch (err) {
        console.log("Error(role get bu id)..", err);
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
const updateRole = async (req, res) => {
    try {
        let dataToBeUpdate = {}
        if (req.body.add_modules) {
            // dataToBeUpdate.$addToSet = { modules: { $each: req.body.add_modules } };
            await updateRoleService(req.params.roleId, { $addToSet: { modules: { $each: req.body.add_modules } } })
        }
        if (req.body.remove_modules) {
            // dataToBeUpdate.$pullAll = { modules: req.body.remove_modules };
            await updateRoleService(req.params.roleId, {
                $pullAll
                    : { modules: req.body.remove_modules }
            })
        }
        if (req.body.role_name)
            dataToBeUpdate.role_name = req.body.role_name
        if (req.body.is_active)
            dataToBeUpdate.is_active = req.body.is_active
        const roleDetail = await updateRoleService(req.params.roleId, dataToBeUpdate)
        return sendResponse(
            req,
            res,
            constants.WEB_STATUS_CODE.OK,
            constants.STATUS_CODE.SUCCESS,
            "Role updated successfully.",
            roleDetail,
        );
    } catch (err) {
        console.log("Error(update role)..", err);
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

const deleteRole = async (req, res) => {
    try {
        const roleDetail = await deleteRoleService(req.params.roleId)

        return sendResponse(
            req,
            res,
            constants.WEB_STATUS_CODE.OK,
            constants.STATUS_CODE.SUCCESS,
            "Role deleted successfully.", +
        roleDetail,
        );
    } catch (err) {
        console.log("Error(update role)..", err);
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
    addRole,
    getRoleList,
    getRoleById,
    updateRole,
    deleteRole
}
