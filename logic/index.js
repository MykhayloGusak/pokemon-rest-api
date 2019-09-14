const { Pokemon, Trainer } = require("../models");
const Joi = require("@hapi/joi");

const logic = {
  readPokemon(name) {
    const schema = Joi.object({
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(15)
    });

    const { error } = schema.validate({ name });
    if (error) throw new Error(error.message);

    return (async () => {
      try {
        const data = await Pokemon.findOne({ name }).lean();
        if (!data) throw new Error(`Pokemon with name ${name} not exists.`);

        return data;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },
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

    const { error } = schema.validate({ name, type, level });
    if (error) throw new Error(error.message);
    return (async () => {
      try {
        const pokemon = await Pokemon.findOne({ name }).lean();
        if (!!pokemon === true)
          throw new Error(`Pokemon with name ${name} already exists`);
        const _pokemon = await new Pokemon({
          name,
          type,
          level
        });
        await _pokemon.save();
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },

  updatePokemon(_name, body) {
    const { name, type, level } = body;
    debugger;
    const schema = Joi.object({
      _name: Joi.string()
        .alphanum()
        .min(2)
        .max(15),
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(15),
      type: Joi.string()
        .alphanum()
        .min(2)
        .max(15),
      level: Joi.number()
    });
    debugger;
    const { error } = schema.validate({ _name, name, type, level });

    if (error) throw new Error(error.message);
    debugger;
    return (async () => {
      try {
        const pokemon = await Pokemon.findOne({ name: _name })
          .select("name type level _id")
          .lean();

        if (!pokemon) throw new Error(`Pokemon with name ${_name} not exists.`);
        const _pokemon = {};
        debugger;
        if (name) _pokemon.name = name;
        if (type) _pokemon.type = type;
        if (level) _pokemon.level = level;
        debugger;
        const data = await Pokemon.findByIdAndUpdate(
          { _id: pokemon._id },
          _pokemon,
          { new: true }
        )
          .select("name type level -_id")
          .lean();
        debugger;
        return data;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },

  deletePokemon(name) {
    debugger;
    const schema = Joi.object({
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(15)
    });
    debugger;
    const { error } = schema.validate({ name });

    if (error) throw new Error(error.message);

    return (async () => {
      try {
        const pokemon = await Pokemon.findOne({ name }).lean();
        if (!pokemon) throw new Error(`Pokemon with name ${name} not exists.`);

        await Pokemon.findByIdAndDelete({ _id: pokemon._id });
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },

  createTrainer(email, firstName, lastName, age, capturedPokemons) {
    // todo validation

    return (async () => {
      try {
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },

  modifyTrainer(email, firstName, lastName, age, capturedPokemons) {
    // todo validation

    return (async () => {
      try {
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },

  deleteTrainer(email) {
    // todo validation

    return (async () => {
      try {
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },

  addPokemonToTrainer() {
    // todo validation

    return (async () => {
      try {
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },

  removePokemonFromTrainer() {
    // todo validation

    return (async () => {
      try {
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },

  getAllPokemons() {
    return (async () => {
      try {
        const data = await Pokemon.find({}).lean();
        if (!data) throw Error(`There are no pokemons.`);
        return data;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },

  getAllTrainers() {
    return (async () => {
      try {
        const data = await Trainer.find({}).lean();
        if (!data) throw Error(`There are no trainers.`);
        return data;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  }
};

module.exports = logic;
