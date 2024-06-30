const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    allowNull: false,
  },
  middle_name: {
    type: String,
    allowNull: false,
  },
  last_name: {
    type: String,
    allowNull: false,
  },
  email: {
    type: String,
    allowNull: false,
  },
  country_code: {
    type: String,
    allowNull: false,
  },
  phone: {
    type: String,
    allowNull: false,
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'roles',
  },
  password: {
    type: String,
    allowNull: false,
  },
},
  { timestamps: true });

const smtp = mongoose.model("users", userSchema);
module.exports = smtp;
