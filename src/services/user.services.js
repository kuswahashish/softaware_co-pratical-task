const User = require("../../models/users.model")

exports.getUserByIdService = async (id) => {
    const userDetail = await User.findById(id).populate({
        path: 'role_id',
        select: 'role_name modules'
    });
    return userDetail;
};

exports.getUsersCountService = async (condition) => {
    const userDetail = await User.countDocuments(condition);
    return userDetail;
};

exports.getUsersDetailService = async (condition) => {
    const userDetail = await User.findOne(condition).lean();
    return userDetail;
};
exports.addUserService = async (data) => {
    const createdUser = await User.create(data);
    return createdUser;
};

exports.getUsersService = async (whereClause, order, offset, limit) => {
    const users = await User.aggregate([
        { $match: whereClause },
        { $sort: order },
        { $skip: offset },
        { $limit: limit },
        {
            $lookup: {
                from: 'roles',
                localField: 'role_id',
                foreignField: '_id',
                as: 'role'
            }
        },
        {
            $addFields: {
                role_Name: { $arrayElemAt: ['$role.role_name', 0] },
                modules: '$role.modules'
            }
        },
        {
            $project: {
                role: 0
            }
        }
    ]);
    return users;
};

exports.updateUserService = async (id, data) => {
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
    return updatedUser;
};

exports.deleteUserService = async (id) => {
    const deletedUser = await User.deleteOne({ _id: id });
    return deletedUser;
};

exports.updateAllUserService = async (data) => {
    const updatedData = await User.updateMany({}, { $set: data });
    return updatedData;
};

exports.bulkWriteUsersService = async (data) => {
    const result = await User.bulkWrite(data);
    return result;
};