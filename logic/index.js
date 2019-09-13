const { Pokemon, Trainer } = require("../models");
const Joi = require("@hapi/joi");

const logic = {
  createPokemon(name, type, level) {
    const schema = Joi.object({
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(15)
        .required(),
      type: Joi.string()
        .alphanum()
        .min(2)
        .max(15)
        .required(),
      level: Joi.number().required()
    });

    const { error, value } = schema.validate({ name, type, level });
    debugger;
    if (error) throw new Error(error.message);
    debugger;
    return (async () => {
      try {
        debugger;
        const pokemon = await Pokemon.findOne({ name }).lean();
        debugger;
        if (!!pokemon === true)
          throw new Error(`Pokemon with name ${name} already exists`);
        debugger;
        const _pokemon = await new Pokemon({
          name,
          type,
          level
        });
        debugger;
        await _pokemon.save();
      } catch (err) {
        debugger;
        throw Error(err.message);
      }
    })();
  },

  updatePokemon(name, type, level) {
    // todo validation

    return (async () => {
      try {
      } catch (err) {}
    })();
  },

  deletePokemon(name) {
    // todo validation

    return (async () => {
      try {
      } catch (err) {}
    })();
  },

  createTrainer(email, firstName, lastName, age, capturedPokemons) {
    // todo validation

    return (async () => {
      try {
      } catch (err) {}
    })();
  },

  modifyTrainer(email, firstName, lastName, age, capturedPokemons) {
    // todo validation

    return (async () => {
      try {
      } catch (err) {}
    })();
  },

  deleteTrainer(email) {
    // todo validation

    return (async () => {
      try {
      } catch (err) {}
    })();
  },

  addPokemonToTrainer() {
    // todo validation

    return (async () => {
      try {
      } catch (err) {}
    })();
  },

  removePokemonFromTrainer() {
    // todo validation

    return (async () => {
      try {
      } catch (err) {}
    })();
  },

  getAllPokemons() {
    return (async () => {
      try {
      } catch (err) {}
    })();
  },

  getAllTrainers() {
    return (async () => {
      try {
      } catch (err) {}
    })();
  }
};

module.exports = logic;
