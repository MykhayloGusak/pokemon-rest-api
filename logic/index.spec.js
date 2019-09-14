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
      useCreateIndex: true,
      useFindAndModify: false,
      findOneAndDelete: false
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
    describe("Read pokemon", () => {
      beforeEach(async () => {
        name = faker.name.firstName();
        type = faker.name.lastName();
        level = faker.random.number();

        await Pokemon.create({ name, type, level });
      });
      it("should succeed on correct pokemon data", async () => {
        const data = await logic.readPokemon(name);
        expect(data).to.exist;
        expect(data.name).to.have.string(name);
        expect(data.type).to.have.string(type);
        expect(data.level)
          .to.equal(level)
          .that.is.a("number");
      });
    });
    describe("Update pokemon", () => {
      let name2, type2, level2;

      beforeEach(async () => {
        name = faker.name.firstName();
        type = faker.name.lastName();
        level = faker.random.number();

        name2 = faker.name.firstName();
        type2 = faker.name.lastName();
        level2 = faker.random.number();

        await Pokemon.create({ name, type, level });
      });

      it("should succeed on correct pokemon data", async () => {
        const data = await logic.updatePokemon(name, {
          name: name2,
          type: type2,
          level: level2
        });
        expect(data).to.exist;
        expect(data.name).to.have.string(name2);
        expect(data.type).to.have.string(type2);
        expect(data.level)
          .to.equal(level2)
          .that.is.a("number");

        const dbData = await Pokemon.findOne({ name: name2 }).lean();
        expect(dbData).to.exist;
        expect(dbData.name).to.have.string(name2);
        expect(dbData.type).to.have.string(type2);
        expect(dbData.level)
          .to.equal(level2)
          .that.is.a("number");
      });
    });
    describe("Delete pokemon", () => {
      beforeEach(async () => {
        name = faker.name.firstName();
        type = faker.name.lastName();
        level = faker.random.number();

        await Pokemon.create({ name, type, level });
      });
      it("should succeed on correct pokemon data", async () => {
        const data = await logic.deletePokemon(name);
        expect(data).not.to.exist;
        const dbData = await Pokemon.findOne({ name });
        expect(dbData).not.to.exist;
      });
    });
  });

  describe("Trainer", () => {
    describe("Create trainer", () => {});
    describe("Read trainer", () => {});
    describe("Update trainer", () => {});
    describe("Delete trainer", () => {});
  });

  after(async () => {
    await Pokemon.deleteMany();
  });
});

// [
//   {
//     name: "Charmander",
//     type: "Fire",
//     level: 1,
//     image:
//       "https://vignette.wikia.nocookie.net/es.pokemon/images/5/56/Charmander.png/revision/latest?cb=20140207202456"
//   },
//   {
//     name: "Squirtle",
//     type: "Water",
//     level: 1,
//     image:
//       "https://vignette.wikia.nocookie.net/es.pokemon/images/e/e3/Squirtle.png/revision/latest?cb=20160309230820"
//   },
//   {
//     name: "Pikachu",
//     type: "Electrical ",
//     level: 1,
//     image:
//       "https://vignette.wikia.nocookie.net/es.pokemon/images/7/77/Pikachu.png/revision/latest?cb=20150621181250"
//   },
//   {
//     name: "Sandshrew",
//     type: "Earth ",
//     level: 1,
//     image:
//       "https://vignette.wikia.nocookie.net/es.pokemon/images/d/df/Sandshrew.png/revision/latest?cb=20080909114740"
//   },
//   {
//     name: "Clefairy",
//     type: "Magic ",
//     level: 1,
//     image:
//       "https://vignette.wikia.nocookie.net/es.pokemon/images/d/d2/Clefairy.png/revision/latest?cb=20170615204912"
//   },
//   ,
//   {
//     name: "Jigglypuff",
//     type: "Normal ",
//     level: 1,
//     image:
//       "https://vignette.wikia.nocookie.net/es.pokemon/images/a/af/Jigglypuff.png/revision/latest?cb=20150110232910"
//   }
// ];
