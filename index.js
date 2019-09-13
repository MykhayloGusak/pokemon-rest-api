require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const logic = require("./logic");

const {
  env: { PORT, MONGO_URL }
} = process;

(async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    });
    console.log(`connected to database MongoDB! Port:${MONGO_URL}`);

    app.use(bodyParser.json());

    app.use(cors());

    app.post("/pokemon", (req, res) => {
      const {
        body: { name, type, level }
      } = req;

      return (async () => {
        try {
          await logic.createPokemon(name, type, level);
          res.status(200).json("Pokemon has been created successfully!");
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.put("/pokemon", (req, res) => {
      const {
        body: { name, type, level }
      } = req;

      return (async () => {
        try {
          await logic.updatePokemon(name, type, level);
          res.status(200).json("Pokemon has been updated successfully!");
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.delete("/pokemon/:name", (req, res) => {
      const {
        body: { name }
      } = req;

      return (async () => {
        try {
          await logic.deletePokemon(name);
          res.status(200).json("Pokemon has been deleted successfully!");
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.get("/pokemon", (req, res) => {
      return (async () => {
        try {
          const data = await logic.getAllPokemons();
          res.status(200).json({ data });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.get("/trainer", (req, res) => {
      return (async () => {
        try {
          const data = await logic.getAllTrainers();
          res.status(200).json({ data });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.use(function(req, res, next) {
      res.status(404).json({ error: "Not found." });
    });

    app.listen(PORT, function() {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
  }
})();
