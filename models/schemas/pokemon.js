const { Schema } = require("mongoose");

module.exports = new Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  level: { type: Number, required: true }
});
