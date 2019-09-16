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
      describe("name fails", () => {
        it("should fails on not existing pokemon with this name", async () => {
          const name = "hulalal";

          try {
            const _resp = await logic.readPokemon(name);
            expect("should not reach this point").not.to.exist;
          } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.have.string(
              `Pokemon with name ${name} not exists.`
            );
          }
        });
        it("should fails on undefined name", async () => {
          const name = undefined;
          try {
            await logic.readPokemon(name);
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
            await logic.readPokemon(name);
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
            await logic.readPokemon(name);
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
            await logic.readPokemon(name);
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"name" must be a string');
          }
        });
        it("should fails on too short name's length", async () => {
          const name = "2";
          try {
            await logic.readPokemon(name);
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
            await logic.readPokemon(name);
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

      describe("original name fails", () => {
        it("should fails on undefined name", async () => {
          const _name = undefined;
          try {
            await logic.updatePokemon(_name, {
              name,
              type,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"_name" is required');
          }
        });
        it("should fails on null name", async () => {
          const _name = null;
          try {
            await logic.updatePokemon(_name, {
              name,
              type,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"_name" must be a string');
          }
        });
        it("should fails on number type of name", async () => {
          const _name = 1;
          try {
            await logic.updatePokemon(_name, {
              name,
              type,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"_name" must be a string');
          }
        });
        it("should fails on object type of name", async () => {
          const _name = {};
          try {
            await logic.updatePokemon(_name, {
              name,
              type,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"_name" must be a string');
          }
        });
        it("should fails on too short name's length", async () => {
          const _name = "1";
          try {
            await logic.updatePokemon(_name, {
              name,
              type,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property(
                "message",
                '"_name" length must be at least 2 characters long'
              );
          }
        });

        it("should fails on too long name's length", async () => {
          const _name = "1234567890123456";
          try {
            await logic.updatePokemon(_name, {
              name,
              type,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property(
                "message",
                '"_name" length must be less than or equal to 15 characters long'
              );
          }
        });
      });
      describe("to change name fails", () => {
        it("should fails on undefined name", async () => {
          const name2 = undefined;
          try {
            await logic.updatePokemon(name, {
              name: name2,
              type,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"name" is required');
          }
        });
        it("should fails on null name", async () => {
          const name2 = null;
          try {
            await logic.updatePokemon(name, {
              name: name2,
              type,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"name" must be a string');
          }
        });
        it("should fails on number type of name", async () => {
          const name2 = 1;
          try {
            await logic.updatePokemon(name, {
              name: name2,
              type,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"name" must be a string');
          }
        });
        it("should fails on object type of name", async () => {
          const name2 = {};
          try {
            await logic.updatePokemon(name, {
              name: name2,
              type,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"name" must be a string');
          }
        });
        it("should fails on too short name's length", async () => {
          const name2 = "1";
          try {
            await logic.updatePokemon(name, {
              name: name2,
              type,
              level
            });
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
          const name2 = "1234567890123456";
          try {
            await logic.updatePokemon(name, {
              name: name2,
              type,
              level
            });
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
      describe("to change type fails", () => {
        it("should fails on undefined type", async () => {
          const type2 = undefined;
          try {
            await logic.updatePokemon(name, {
              name,
              type: type2,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"type" is required');
          }
        });
        it("should fails on null type", async () => {
          const type2 = null;
          try {
            await logic.updatePokemon(name, {
              name,
              type: type2,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"type" must be a string');
          }
        });
        it("should fails on number type of type", async () => {
          const type2 = 1;
          try {
            await logic.updatePokemon(name, {
              name,
              type: type2,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"type" must be a string');
          }
        });
        it("should fails on object type of type", async () => {
          const type2 = {};
          try {
            await logic.updatePokemon(name, {
              name,
              type: type2,
              level
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"type" must be a string');
          }
        });
        it("should fails on too short type's length", async () => {
          const type2 = "ab";
          try {
            await logic.updatePokemon(name, {
              name,
              type: type2,
              level
            });
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
          const type2 = "1234567890123456";
          try {
            await logic.updatePokemon(name, {
              name,
              type: type2,
              level
            });
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
      describe("to change level fails", () => {
        it("should fails on undefined level", async () => {
          const level2 = undefined;
          try {
            await logic.updatePokemon(name, {
              name,
              type,
              level: level2
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"level" is required');
          }
        });
        it("should fails on null level", async () => {
          const level2 = null;
          try {
            await logic.updatePokemon(name, {
              name,
              type,
              level: level2
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"level" must be a number');
          }
        });
        it("should fails on string type of level", async () => {
          const level2 = "string";
          try {
            await logic.updatePokemon(name, {
              name,
              type,
              level: level2
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"level" must be a number');
          }
        });
        it("should fails on object type of level", async () => {
          const level2 = {};
          try {
            await logic.updatePokemon(name, {
              name,
              type,
              level: level2
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"level" must be a number');
          }
        });
        it("should fails on too short type's length", async () => {
          const level2 = 1;
          try {
            await logic.updatePokemon(name, {
              name,
              type,
              level: level2
            });
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
          const level2 = 12345678901234567;
          try {
            await logic.updatePokemon(name, {
              name,
              type,
              level: level2
            });
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"level" must be a safe number');
          }
        });
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
      describe("name fails", () => {
        it("should fails on not existing pokemon with this name", async () => {
          const name = "hulalal";

          try {
            const _resp = await logic.deletePokemon(name);
            expect("should not reach this point").not.to.exist;
          } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.have.string(
              `Pokemon with name ${name} not exists.`
            );
          }
        });
        it("should fails on undefined name", async () => {
          const name = undefined;
          try {
            await logic.deletePokemon(name);
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
            await logic.deletePokemon(name);
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
            await logic.deletePokemon(name);
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
            await logic.deletePokemon(name);
            expect("should not reach this point").to.exist;
          } catch (err) {
            expect(err)
              .to.be.an.instanceof(Error)
              .with.property("message", '"name" must be a string');
          }
        });
        it("should fails on too short name's length", async () => {
          const name = "2";
          try {
            await logic.deletePokemon(name);
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
            await logic.deletePokemon(name);
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
    });
    describe("Get all pokemons", () => {
      let name2, name3, type2, type3, level2, level3;
      beforeEach(async () => {
        name = faker.name.firstName();
        type = faker.name.lastName();
        level = faker.random.number();

        name2 = faker.name.firstName();
        type2 = faker.name.lastName();
        level2 = faker.random.number();

        name3 = faker.name.firstName();
        type3 = faker.name.lastName();
        level3 = faker.random.number();

        await Pokemon.deleteMany();

        await Pokemon.create({ name, type, level });
        await Pokemon.create({ name: name2, type: type2, level: level2 });
        await Pokemon.create({ name: name3, type: type3, level: level3 });
      });

      it("should succeed on correct trainer data", async () => {
        const data = await logic.getAllPokemons();
        expect(data).to.have.lengthOf(3);

        expect(data[0]).to.be.an.instanceof(Object);
        expect(data[1]).to.be.an.instanceof(Object);
        expect(data[2]).to.be.an.instanceof(Object);
        expect(data[3]).not.to.exist;

        expect(data[0].name).to.have.string(name);
        expect(data[1].name).to.have.string(name2);
        expect(data[2].name).to.have.string(name3);

        expect(data[0].type).to.have.string(type);
        expect(data[1].type).to.have.string(type2);
        expect(data[2].type).to.have.string(type3);

        expect(data[0].level)
          .to.equal(level)
          .that.is.a("number");
        expect(data[1].level)
          .to.equal(level2)
          .that.is.a("number");
        expect(data[2].level)
          .to.equal(level3)
          .that.is.a("number");

        expect(data[0]._id).to.be.an.instanceof(Object);
        expect(data[1]._id).to.be.an.instanceof(Object);
        expect(data[2]._id).to.be.an.instanceof(Object);
      });
    });
  });

  describe("Trainer", () => {
    let email, password, firstName, lastName, age, id;
    afterEach(async () => {
      await Trainer.deleteMany()
    });
    describe("Create trainer", () => {
      beforeEach(() => {
        email = faker.internet.email();
        password = "32r3f3g3g";
        firstName = faker.name.firstName();
        lastName = faker.name.lastName();
        age = faker.random.number();
      });

      it("should succeed on correct trainer data", async () => {
        const { id } = await logic.createTrainer(
          email,
          password,
          firstName,
          lastName,
          age
        );
        expect(id).to.exist;
        expect(id).to.have.lengthOf(24);

        const data = await Trainer.findOne({ email }).lean();
        expect(data).to.exist;

        expect(data.email).to.have.string(email);
        expect(data.password).to.have.string(password);
        expect(data.firstName).to.have.string(firstName);
        expect(data.lastName).to.have.string(lastName);
        expect(data.capturedPokemon).to.be.an("array").that.is.empty;
        expect(data.age)
          .to.equal(age)
          .that.is.a("number");
        expect(data._id).to.be.an.instanceof(Object);
      });

      describe("Fails email", () => {
        it("should fails on already existing trainer with this email", async () => {
          await Trainer.create({ email, password, firstName, lastName, age });

          try {
            await logic.createTrainer(
              email,
              password,
              firstName,
              lastName,
              age
            );

            expect("should not reach this point").not.to.exist;
          } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.have.string(
              `Trainer with email ${email} already exists`
            );
          }
        });
      });
    });
    describe("Auth trainer", () => {
      beforeEach(async () => {
        email = faker.internet.email();
        password = "12321fewf";
        firstName = faker.name.firstName();
        lastName = faker.name.lastName();
        age = faker.random.number();

        await Trainer.create({ email, password, firstName, lastName, age });
      });

      it("should succeed on correct password", async () => {
        const res = await logic.authTrainer(email, password);
        expect(res).not.to.exist;
      });

      describe("Fails email", () => {
        it("should fail on bad email", async () => {
          email = "bad@email.com";

          try {
            const res = await logic.authTrainer(email, password);
            expect("should not reach this point").not.to.exist;
          } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.have.string(
              `Trainer with email ${email} not exists.`
            );
          }
        });
      });
      describe("Fails password", () => {
        it("should fail on bad password", async () => {
          password = "badpassword";

          try {
            const res = await logic.authTrainer(email, password);
            expect("should not reach this point").not.to.exist;
          } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.have.string(`Wrong password!`);
          }
        });
        it("should fail on undefined password", async () => {
          password = undefined;

          try {
            const res = await logic.authTrainer(email, password);
            expect("should not reach this point").not.to.exist;
          } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.have.string(`"password" is required`);
          }
        });
        it("should fail on null password", async () => {
          password = null;

          try {
            const res = await logic.authTrainer(email, password);
            expect("should not reach this point").not.to.exist;
          } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.have.string(`"password" must be a string`);
          }
        });
      });
    });
    describe("Read trainer", () => {
      beforeEach(async () => {
        email = faker.internet.email();
        password = "32r3f3g3g";
        firstName = faker.name.firstName();
        lastName = faker.name.lastName();
        age = faker.random.number();

        await Trainer.create({ email, password, firstName, lastName, age });
        const { _id } = await Trainer.findOne({ email })
          .select("_id")
          .lean();
        id = _id.toString();
      });

      it("should succeed on correct trainer data", async () => {
        const data = await logic.readTrainer(id);

        expect(data.email).to.have.string(email);
        expect(data.password).not.to.exist;
        expect(data.firstName).to.have.string(firstName);
        expect(data.lastName).to.have.string(lastName);
        expect(data.capturedPokemon).to.be.an("array").that.is.empty;
        expect(data.age)
          .to.equal(age)
          .that.is.a("number");
        expect(data._id).not.to.exist;
      });
      describe("Fails ID", () => {
        it("should fails on non existing ID", async () => {
          id = "5d7e645c91130601cc7eba86";
          try {
            await logic.readTrainer(id);
            expect("should not reach this point").not.to.exist;
          } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.have.string(`Trainer with ID not exists.`);
          }
        });
        it("should fails on no valid ID", async () => {
          id = "5d7e6@a83aadc-1010_2a8e2";

          try {
            await logic.readTrainer(id);
            expect("should not reach this point").not.to.exist;
          } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.have.string(
              `"id" with value "${id}" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`
            );
          }
        });
      });
    });
    describe("Update trainer", () => {
      let email2, password2, firstName2, lastName2, age2, id;
      beforeEach(async () => {
        email = faker.internet.email();
        password = "32r3f3g3g";
        firstName = faker.name.firstName();
        lastName = faker.name.lastName();
        age = faker.random.number();

        email2 = faker.internet.email();
        password2 = "dw22d3dSD3";
        firstName2 = faker.name.firstName();
        lastName2 = faker.name.lastName();
        age2 = faker.random.number();
      });

      it("should succeed on correct trainer data", async () => {
        const { _id: id } = await Trainer.create({
          email,
          password,
          firstName,
          lastName,
          age
        });

        const data = await logic.updateTrainer(id, {
          email: email2,
          firstName: firstName2,
          lastName: lastName2,
          age: age2
        });

        expect(data.email).to.have.string(email2);
        expect(data.password).not.to.exist;
        expect(data.firstName).to.have.string(firstName2);
        expect(data.lastName).to.have.string(lastName2);
        expect(data.capturedPokemon).not.to.exist;
        expect(data.age)
          .to.equal(age2)
          .that.is.a("number");
        expect(data._id).not.to.exist;

        const dataDb = await Trainer.findById(id)
          .select("email firstName lastName age -_id")
          .lean();

        expect(dataDb.email).to.have.string(email2);
        expect(dataDb.firstName).to.have.string(firstName2);
        expect(dataDb.lastName).to.have.string(lastName2);
        expect(dataDb.age)
          .to.equal(age2)
          .that.is.a("number");
      });

      describe("Fails ID", () => {
        it("should fails on non existing ID", async () => {
          id = "5d7e645c91130601cc7eba86";
          try {
            await logic.updateTrainer(id, {
              email,
              firstName,
              lastName,
              age
            });
            expect("should not reach this point").not.to.exist;
          } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.have.string(`Trainer with ID not exists.`);
          }
        });
      });
    });
    describe("Delete trainer", () => {
      beforeEach(async () => {
        email = faker.internet.email();
        password = "32r3f3g3g";
        firstName = faker.name.firstName();
        lastName = faker.name.lastName();
        age = faker.random.number();
      });

      it("should succeed on correct trainer data", async () => {
        const { _id: id } = await Trainer.create({
          email,
          password,
          firstName,
          lastName,
          age
        });

        await logic.deleteTrainer(id.toString());
        const data = await Trainer.findById(id);
        expect(data).not.to.exist;
      });

      describe("Fails ID", () => {
        it("should fails on non existing ID", async () => {
          id = "5d7e645c91130601cc7eba86";
          try {
            await logic.readTrainer(id);
            expect("should not reach this point").not.to.exist;
          } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.have.string(`Trainer with ID not exists.`);
          }
        });
        it("should fails on no valid ID", async () => {
          id = "5d7e6@a83aadc-1010_2a8e2";

          try {
            await logic.readTrainer(id);
            expect("should not reach this point").not.to.exist;
          } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.have.string(
              `"id" with value "${id}" fails to match the required pattern: /^[0-9a-fA-F]{24}$/`
            );
          }
        });
      });
    });
    describe("Get trainer's pokemons", () => {});

    describe("Get all trainers", () => {
      let email2,
        email3,
        firstName2,
        firstName3,
        lastName2,
        lastName3,
        age2,
        age3,
        password2,
        password3;

      beforeEach(async () => {
        email = faker.internet.email();
        password = "32r3f3g3g";
        firstName = faker.name.firstName();
        lastName = faker.name.lastName();
        age = faker.random.number();

        email2 = faker.internet.email();
        password2 = "32r3f3g3g";
        firstName2 = faker.name.firstName();
        lastName2 = faker.name.lastName();
        age2 = faker.random.number();

        email3 = faker.internet.email();
        password3 = "32r3f3g3g";
        firstName3 = faker.name.firstName();
        lastName3 = faker.name.lastName();
        age3 = faker.random.number();

        await Trainer.deleteMany();

        await Trainer.create({
          email,
          password,
          firstName,
          lastName,
          age
        });

        await Trainer.create({
          email: email2,
          password: password2,
          firstName: firstName2,
          lastName: lastName2,
          age: age2
        });

        await Trainer.create({
          email: email3,
          password: password3,
          firstName: firstName3,
          lastName: lastName3,
          age: age3
        });
      });
      it("should succeed on correct trainer data", async () => {
        const data = await logic.getAllTrainers();
        expect(data).to.have.lengthOf(3);

        expect(data[0]).to.be.an.instanceof(Object);
        expect(data[1]).to.be.an.instanceof(Object);
        expect(data[2]).to.be.an.instanceof(Object);
        expect(data[3]).not.to.exist;

        expect(data[0].email).to.have.string(email);
        expect(data[1].email).to.have.string(email2);
        expect(data[2].email).to.have.string(email3);

        expect(data[0].firstName).to.have.string(firstName);
        expect(data[1].firstName).to.have.string(firstName2);
        expect(data[2].firstName).to.have.string(firstName3);

        expect(data[0].lastName).to.have.string(lastName);
        expect(data[1].lastName).to.have.string(lastName2);
        expect(data[2].lastName).to.have.string(lastName3);

        expect(data[0].age)
          .to.equal(age)
          .that.is.a("number");
        expect(data[1].age)
          .to.equal(age2)
          .that.is.a("number");
        expect(data[2].age)
          .to.equal(age3)
          .that.is.a("number");
      });
    });
    describe("Toggle pokemon to capturedPokemon", () => {
      let name, type, level, trainerId, pokemonId;
      beforeEach(async () => {
        email = faker.internet.email();
        password = "32r3f3g3g";
        firstName = faker.name.firstName();
        lastName = faker.name.lastName();
        age = faker.random.number();

        name = faker.name.firstName();
        type = faker.name.lastName();
        level = faker.random.number();

        const { _id: _pokemonId } = await Pokemon.create({ name, type, level });
        const { _id: _trainerId } = await Trainer.create({
          email,
          password,
          firstName,
          lastName,
          age
        });

        trainerId = _trainerId.toString();
        pokemonId = _pokemonId.toString();
      });

      it("should succeed on correct toggled pokemon", async () => {
        const resp = await logic.togglePokemon(trainerId, pokemonId);

        expect(resp.capturedPokemon).to.be.an("array");
        expect(resp.capturedPokemon).to.have.lengthOf(1);

        const dataDb = await Trainer.findById(trainerId)
          .select("capturedPokemon -_id")
          .lean();

        expect(dataDb.capturedPokemon).to.be.an("array");
        expect(dataDb.capturedPokemon).to.have.lengthOf(1);

        const _resp = await logic.togglePokemon(trainerId, pokemonId);

        expect(_resp.capturedPokemon).to.be.an("array");
        expect(_resp.capturedPokemon).to.have.lengthOf(0);

        const _dataDb = await Trainer.findById(trainerId)
          .select("capturedPokemon -_id")
          .lean();

        expect(_dataDb.capturedPokemon).to.be.an("array");
        expect(_dataDb.capturedPokemon).to.have.lengthOf(0);
      });
    });
    describe("Get first name of trainers with number of captured pokemons", () => {
      beforeEach(async () => {
        email = faker.internet.email();
        password = "32r3f3g3g";
        firstName = faker.name.firstName();
        lastName = faker.name.lastName();
        age = faker.random.number();

        email2 = faker.internet.email();
        password2 = "32r3f3g3g";
        firstName2 = faker.name.firstName();
        lastName2 = faker.name.lastName();
        age2 = faker.random.number();

        email3 = faker.internet.email();
        password3 = "32r3f3g3g";
        firstName3 = faker.name.firstName();
        lastName3 = faker.name.lastName();
        age3 = faker.random.number();

        await Trainer.deleteMany();

        await Trainer.create({
          email,
          password,
          firstName,
          lastName,
          age
        });

        await Trainer.create({
          email: email2,
          password: password2,
          firstName: firstName2,
          lastName: lastName2,
          age: age2
        });

        await Trainer.create({
          email: email3,
          password: password3,
          firstName: firstName3,
          lastName: lastName3,
          age: age3
        });
      });
      it("should succeed on correct trainer data", async () => {
        const data = await logic.getAllTrainersWithNumberOfPokemons();
        expect(data).to.have.lengthOf(3);
      });
    });
  });

  after(async () => {
    await Pokemon.deleteMany();
    await Trainer.deleteMany();
  });
});
