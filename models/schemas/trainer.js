const { Schema } = require("mongoose");
// const { isEmail } = require('validator')

module.exports = new Schema({
  date: { type: Date, default: Date.now },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  capturedPokemons: [{ type: Schema.Types.ObjectId, ref: "Pokemon" }]
});
