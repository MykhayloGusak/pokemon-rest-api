const mongoose = require("mongoose");

const trainer = require("./schemas/trainer");
const pokemon = require("./schemas/pokemon");

const model = mongoose.model.bind(mongoose);

module.exports = {
  Trainer: model("Trainer", trainer),
  Pokemon: model("Pokemon", pokemon)
};
