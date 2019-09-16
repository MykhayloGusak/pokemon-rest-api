const { Schema } = require("mongoose");

module.exports = new Schema({
  date: { type: Date, default: Date.now },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  capturedPokemon: [{ type: Schema.Types.ObjectId, ref: "Pokemon" }]
});
