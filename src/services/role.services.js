const Role = require("../../models/roels.model")

exports.getRoleByIdService = async (id) => {
    const roleDetail = await Role.findById(id);
    return roleDetail;
};

exports.getRolesCount = async (condition) => {
    const roleDetail = await Role.countDocuments(condition);
    return roleDetail;
};

exports.addRoleService = async (data) => {
    const createdRole = await Role.create(data);
    return createdRole;
};

exports.getRolesService = async (whereClause, order, offset, limit) => {
    const roles = await Role.find(
        whereClause
    ).sort(order).skip(offset)
        .limit(limit);;
    return roles;
};

exports.updateRoleService = async (id, data) => {
    const createdRole = await Role.findByIdAndUpdate(id, data, { new: true });
    return createdRole;
};

exports.deleteRoleService = async (id) => {
    const deletedRole = await Role.deleteOne({ _id: id });
    return deletedRole;
};