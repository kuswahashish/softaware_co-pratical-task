const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    allowNull: false,
  },
  modules: [{ type: String }],
  is_active: {
    type: Boolean,
    default: true,
  }
},
  { timestamps: true });

const smtp = mongoose.model("roles", roleSchema);
module.exports = smtp;
