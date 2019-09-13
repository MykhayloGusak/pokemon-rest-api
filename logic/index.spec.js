require("dotenv").config();
const mongoose = require("mongoose");

const { Pokemon, Trainer } = require("../models");
const expect = require("chai").expect;
const logic = require("./index");
const faker = require("faker");

const {
  env: { MONGO_URL_LOGIC_TEST }
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

      describe("data fails", () => {
        describe("name fails", () => {
          it("should fails on already existing pokemon with this name", async () => {
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

          it("should fails on undefined name", async () => {
            const name = undefined;
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"name" is required');
            }
          });
          it("should fails on null name", async () => {
            const name = null;
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"name" must be a string');
            }
          });
          it("should fails on number type of name", async () => {
            const name = 1;
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"name" must be a string');
            }
          });
          it("should fails on object type of name", async () => {
            const name = {};
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"name" must be a string');
            }
          });
          it("should fails on too short name's length", async () => {
            const name = "12";
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property(
                  "message",
                  '"name" length must be at least 2 characters long'
                );
            }
          });

          it("should fails on too long name's length", async () => {
            const name = "1234567890123456";
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property(
                  "message",
                  '"name" length must be less than or equal to 15 characters long'
                );
            }
          });
        });
        describe("type fails", () => {
          it("should fails on undefined type", async () => {
            const type = undefined;
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"type" is required');
            }
          });
          it("should fails on null type", async () => {
            const type = null;
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"type" must be a string');
            }
          });
          it("should fails on number type of type", async () => {
            const type = 1;
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"type" must be a string');
            }
          });
          it("should fails on object type of type", async () => {
            const type = {};
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"type" must be a string');
            }
          });
          it("should fails on too short type's length", async () => {
            const type = "ab";
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property(
                  "message",
                  '"type" length must be at least 2 characters long'
                );
            }
          });

          it("should fails on too long type's length", async () => {
            const type = "1234567890123456";
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property(
                  "message",
                  '"type" length must be less than or equal to 15 characters long'
                );
            }
          });
        });
        describe("level fails", () => {
          it("should fails on undefined level", async () => {
            const level = undefined;
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"level" is required');
            }
          });
          it("should fails on null level", async () => {
            const level = null;
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"level" must be a number');
            }
          });
          it("should fails on string type of level", async () => {
            const level = "string";
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"level" must be a number');
            }
          });
          it("should fails on object type of level", async () => {
            const level = {};
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"level" must be a number');
            }
          });
          it("should fails on too short type's length", async () => {
            const level = 1;
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property(
                  "message",
                  '"level" length must be at least 2 characters long'
                );
            }
          });

          it("should fails on too long type's length", async () => {
            const level = 12345678901234567;
            try {
              await logic.createPokemon(name, type, level);
              expect("should not reach this point").to.exist;
            } catch (err) {
              expect(err)
                .to.be.an.instanceof(Error)
                .with.property("message", '"level" must be a safe number');
            }
          });
        });
      });
    });
    describe("Update pokemon", () => {});
    describe("Delete pokemon", () => {});
  });

  after(async () => {
    await Pokemon.deleteMany();
  });
});
