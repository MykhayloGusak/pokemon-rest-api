require("dotenv").config();
const mongoose = require("mongoose");

const { Pokemon, Trainer } = require("../models");
const expect = require("chai").expect;
const logic = require("./index");
const faker = require("faker");

const {
  env: { PORT, MONGO_URL_LOGIC_TEST }
} = process;

describe("logic", () => {
  before(async () => {
    await mongoose.connect(MONGO_URL_LOGIC_TEST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });
    console.log(`connected to database MongoDB! Port:${MONGO_URL_LOGIC_TEST}`);
  });

  describe("Pokemon", () => {
    let name, type, level;

    describe("Create pokemon", () => {
      beforeEach(() => {
        name = faker.name.firstName();
        type = faker.name.lastName();
        level = faker.random.number();
      });

      it("should succeed on correct pokemon data", async () => {
        const resp = await logic.createPokemon(name, type, level);
        expect(resp).not.to.exist;

        const data = await Pokemon.findOne({ name }).lean();
        expect(data).to.exist;

        expect(data.name).to.have.string(name);
        expect(data.type).to.have.string(type);
        expect(data.level)
          .to.equal(level)
          .that.is.a("number");
        expect(data._id).to.be.an.instanceof(Object);
      });

      it("should fail on already existing pokemon with this name", async () => {
        const resp = await logic.createPokemon(name, type, level);
        expect(resp).not.to.exist;

        try {
          const _resp = await logic.createPokemon(name, type, level);
          expect("should not reach this point").not.to.exist;
        } catch (err) {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.have.string(
            `Pokemon with name ${name} already exists`
          );
        }
      });
    });
    describe("Update pokemon", () => {});
    describe("Delete pokemon", () => {});
  });

  after(async () => {
    await Pokemon.deleteMany();
  });
});
