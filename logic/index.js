const { Pokemon, Trainer } = require("../models");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");

/**
 * Abstraction of business logic.
 */
const logic = {
  /**
   * Read pokemon information
   *
   * @param {String} name
   *
   * @throws {Error} - If the name has an invalid format
   * @throws {Error} - If the name non exists
   * @throws {Error} - connection error
   *
   */
  readPokemon(name) {
    const schema = Joi.object({
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(15)
        .required()
    });

    const { error } = schema.validate({ name });
    if (error) throw new Error(error.message);

    return (async () => {
      try {
        const data = await Pokemon.findOne({ name })
          .select("name type level _id")
          .lean();
        if (!data) throw new Error(`Pokemon with name ${name} not exists.`);

        return data;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },
  /**
   * Create pokemon
   *
   * @param {String} name
   * @param {String} name
   * @param {Number} level
   *
   * @throws {Error} - If the name,type or level has an invalid format
   * @throws {Error} - If the name already exists
   * @throws {Error} - connection error
   *
   * @returns {Object} - Information about created pokemon
   */
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
  /**
   * Update pokemon's information
   *
   * @param {String} _name
   * @param {Object} body
   *
   * @throws {Error} - If the _name has an invalid format
   * @throws {Error} - If the _name non exists
   * @throws {Error} - connection error
   *
   * @returns {Object} - Updated information of pokemon
   */
  updatePokemon(_name, body) {
    const { name, type, level } = body;
    const schema = Joi.object({
      _name: Joi.string()
        .alphanum()
        .min(2)
        .max(15)
        .required(),
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
    const { error } = schema.validate({ _name, name, type, level });

    if (error) throw new Error(error.message);
    return (async () => {
      try {
        const pokemon = await Pokemon.findOne({ name: _name })
          .select("name type level _id")
          .lean();

        if (!pokemon) throw new Error(`Pokemon with name ${_name} not exists.`);
        const _pokemon = {};
        if (name) _pokemon.name = name;
        if (type) _pokemon.type = type;
        if (level) _pokemon.level = level;
        const data = await Pokemon.findByIdAndUpdate(
          { _id: pokemon._id },
          _pokemon,
          { new: true }
        )
          .select("name type level -_id")
          .lean();
        return data;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },
  /**
   * Delete pokemon
   *
   * @param {String} name
   *
   * @throws {Error} - If the name has an invalid format
   * @throws {Error} - If the name non exists
   * @throws {Error} - connection error
   *
   */
  deletePokemon(name) {
    const schema = Joi.object({
      name: Joi.string()
        .alphanum()
        .min(2)
        .max(15)
        .required()
    });
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
  /**
   * Create trainer
   *
   * @param {String} email
   * @param {String} password
   * @param {String} firstName
   * @param {String} lastName
   * @param {Number} age
   *
   * @throws {Error} - If the email, password, firstName, lastName or age has an invalid format
   * @throws {Error} - If the email already exists
   * @throws {Error} - connection error
   *
   * @returns {Object} - Id
   */
  createTrainer(email, password, firstName, lastName, age) {
    const schema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
      firstName: Joi.string()
        .alphanum()
        .min(2)
        .max(15)
        .required(),
      lastName: Joi.string()
        .alphanum()
        .min(2)
        .max(15)
        .required(),
      age: Joi.number().required()
    });
    const { error } = schema.validate({
      email,
      password,
      firstName,
      lastName,
      age
    });

    if (error) throw new Error(error.message);

    return (async () => {
      try {
        const trainer = await Trainer.findOne({ email });
        if (!!trainer === true)
          throw new Error(`Trainer with email ${email} already exists`);
        const { _id } = await Trainer.create({
          email,
          password,
          firstName,
          lastName,
          age
        });
        return { id: _id.toString() };
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },
  /**
   * Auth trainer
   *
   * @param {String} email
   * @param {String} password
   *
   * @throws {Error} - If the email or password has an invalid format
   * @throws {Error} - If the email non exists
   * @throws {Error} - connection error
   *
   * @returns {Object} - Id
   */
  authTrainer(email, password) {
    const schema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required()
    });
    const { error } = schema.validate({ email, password });

    if (error) throw new Error(error.message);
    return (async () => {
      try {
        const data = await Trainer.findOne({ email })
          .select("email password firstName lastName age capturedPokemon -_id")
          .lean();
        if (!data) throw new Error(`Trainer with email ${email} not exists.`);

        if (password !== data.password) throw new Error(`Wrong password!`);
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },
  /**
   * Update trainer's information
   *
   * @param {String} id
   * @param {String} email
   * @param {String} password
   * @param {String} firstName
   * @param {String} lastName
   * @param {Number} age
   *
   * @throws {Error} - If the id, email, password, firstName, lastName or age has an invalid format
   * @throws {Error} - If the email non exists
   * @throws {Error} - If the id non exists
   * @throws {Error} - Connection error
   *
   * @returns {Object} - Updated information about trainer
   */
  updateTrainer(id, { email, firstName, lastName, age }) {
    const schema = Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      email: Joi.string().email({ minDomainSegments: 2 }),
      firstName: Joi.string()
        .alphanum()
        .min(2)
        .max(15),
      lastName: Joi.string()
        .alphanum()
        .min(2)
        .max(15),
      age: Joi.number()
    });
    return (async () => {
      try {
        const trainer = await Trainer.findById(id)
          .select("email firstName lastName age -_id")
          .lean();
        if (!trainer) throw new Error(`Trainer with ID not exists.`);
        if (email) trainer.email = email;
        if (firstName) trainer.firstName = firstName;
        if (lastName) trainer.lastName = lastName;
        if (age) trainer.age = age;
        const data = await Trainer.findOneAndUpdate({ _id: id }, trainer, {
          new: true
        })
          .select("email firstName lastName age -_id")
          .lean();
        return data;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },
  /**
   * Read trainer's information
   *
   * @param {String} id
   *
   * @throws {Error} - If the id has an invalid format
   * @throws {Error} - If the id non exists
   * @throws {Error} - Connection error
   *
   * @returns {Object} - Information about trainer
   */
  readTrainer(id) {
    const schema = Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    });
    const { error } = schema.validate({ id });

    if (error) throw new Error(error.message);
    return (async () => {
      try {
        const data = await Trainer.findById(id)
          .select("email firstName lastName age capturedPokemon -_id")
          .lean();
        if (!data) throw Error(`Trainer with ID not exists.`);
        return data;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },
  /**
   * Delete trainer
   *
   * @param {String} id
   *
   * @throws {Error} - If the id has an invalid format
   * @throws {Error} - If the id non exists
   * @throws {Error} - Connection error
   *
   */
  deleteTrainer(id) {
    const schema = Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    });
    const { error } = schema.validate({ id });

    if (error) throw Error(error.message);

    return (async () => {
      try {
        const data = await Trainer.findById(id);
        if (!data) throw Error("User with this ID not exists.");
        await Trainer.findByIdAndDelete(id);
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },
  /**
   * Toggle pokemon to trainer capturedPokemon list
   *
   * @param {String} trainerID
   * @param {String} pokemonId
   *
   *
   * @throws {Error} - If the trainerID or pokemonId has an invalid format
   * @throws {Error} - If the trainerID or pokemonId non exists
   * @throws {Error} - Connection error
   *
   * @returns {Object} - Updated information about trainer with toggled pokemon
   */
  togglePokemon(trainerId, pokemonId) {
    const schema = Joi.object({
      trainerId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      pokemonId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    });
    const { error } = schema.validate({ trainerId, pokemonId });
    debugger;
    if (error) throw Error(error.message);
    debugger;
    return (async () => {
      try {
        const { capturedPokemon } = await Trainer.findById(trainerId)
          .select("capturedPokemon -_id")
          .lean();
        debugger;
        const index = capturedPokemon.findIndex(
          elem => elem.toString() == pokemonId
        );
        debugger;
        if (index > -1) capturedPokemon.splice(index, 1);
        else capturedPokemon.push(pokemonId);
        debugger;
        const data = await Trainer.findByIdAndUpdate(
          trainerId,
          { capturedPokemon },
          { new: true }
        );
        return data;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },
  /**
   * Read all registered pokemons from DDBB
   *
   * @throws {Error} - If BBDD has not any registered pokemon
   * @throws {Error} - Connection error
   *
   * @returns {Array} - Information about pokemons
   */
  getAllPokemons() {
    return (async () => {
      try {
        const data = await Pokemon.find({})
          .select("name type level _id")
          .lean();
        if (!data) throw Error(`There are no pokemons.`);
        return data;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },
  /**
   * Read the number of all registered pokemons from DDBB
   *
   * @throws {Error} - If BBDD has not any registered pokemon
   * @throws {Error} - Connection error
   *
   * @returns {Object} - Number of registered pokemons
   */
  getNumberOfRegisteredPokemons() {
    return (async () => {
      try {
        const total = await Pokemon.find({}).lean();
        if (!total) throw Error(`There are no pokemons.`);
        return total.length;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },
  /**
   * Read all registered trainers from DDBB
   *
   * @throws {Error} - If BBDD has not any registered trainers
   * @throws {Error} - Connection error
   *
   * @returns {Array} - Information about trainers
   */
  getAllTrainers() {
    return (async () => {
      try {
        const data = await Trainer.find({})
          .select("email firstName lastName age capturedPokemon _id")
          .populate("capturedPokemon")
          .lean();
        if (!data) throw Error(`There are no trainers.`);
        return data;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  },
  /**
   * Read all firstName and numbers of captured pokemons of every registered trainer
   *
   * @throws {Error} - If BBDD has not any registered trainers
   * @throws {Error} - Connection error
   *
   * @returns {Array} - Information about trainers and captured pokemons
   */
  getAllTrainersWithNumberOfPokemons() {
    return (async () => {
      try {
        const data = await Trainer.find({})
          .select("firstName capturedPokemon -_id")
          .lean();
        if (!data) throw Error(`There are no trainers.`);
        const _data = [];
        data.map(({ firstName, capturedPokemon }, index) => {
          _data[
            index
          ] = `Trainer ${firstName} has ${capturedPokemon.length} captured pokemons.`;
        });
        return _data;
      } catch (err) {
        throw Error(err.message);
      }
    })();
  }
};

module.exports = logic;
