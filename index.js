require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const logic = require("./logic");
const jwt = require("jsonwebtoken");
const auth = require("./common/auth");

const {
  env: { PORT, MONGO_URL, JWT_SECRET }
} = process;

(async () => {
  try {
    await mongoose.connect(MONGO_URL || "mongodb://localhost/pokemon-db", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log(`connected to database MongoDB! Port:${MONGO_URL}`);

    app.use(bodyParser.json());

    app.use(cors());

    app.get("/pokemon/:name", (req, res) => {
      const {
        params: { name }
      } = req;

      return (async () => {
        try {
          const data = await logic.readPokemon(name);
          res.status(200).json({ data });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.post("/pokemon", (req, res) => {
      const {
        body: { name, type, level }
      } = req;

      return (async () => {
        try {
          await logic.createPokemon(name, type, level);
          res
            .status(200)
            .json({ message: "Pokemon has been created successfully!" });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.put("/pokemon/:name", (req, res) => {
      const {
        body,
        params: { name }
      } = req;
      debugger;
      return (async () => {
        try {
          const data = await logic.updatePokemon(name, body);
          res.status(200).json({ data });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.delete("/pokemon/:name", (req, res) => {
      const {
        params: { name }
      } = req;

      return (async () => {
        try {
          const data = await logic.deletePokemon(name);
          res
            .status(200)
            .json({ message: "Pokemon has been deleted successfully!" });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.get("/pokemons", (req, res) => {
      return (async () => {
        try {
          const data = await logic.getAllPokemons();
          res.status(200).json({ data });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.get("/pokemons/registered", (req, res) => {
      return (async () => {
        try {
          const data = await logic.getNumberOfRegisteredPokemons();
          res.status(200).json({ data });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.post("/trainer/create", (req, res) => {
      const {
        body: { email, password, firstName, lastName, age }
      } = req;

      return (async () => {
        try {
          const id = await logic.createTrainer(
            email,
            password,
            firstName,
            lastName,
            age
          );
          const token = await jwt.sign({ id }, JWT_SECRET, {
            expiresIn: "47m"
          });

          res.status(200).json({ token });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.post("/trainer/auth", (req, res) => {
      const {
        body: { email, password }
      } = req;
      debugger;
      return (async () => {
        try {
          const data = await logic.authTrainer(email, password);
          debugger;
          res.status(200).json({ data });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.get("/trainers", auth, (req, res) => {
      return (async () => {
        try {
          const data = await logic.getAllTrainers();
          res.status(200).json({ data });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.get("/trainer/all", auth, (req, res) => {
      return (async () => {
        try {
          const data = await logic.getAllTrainersWithNumberOfPokemons();
          res.status(200).json({ data });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.get("/trainer", auth, (req, res) => {
      debugger;
      const {
        userId: { id }
      } = req;
      debugger;
      return (async () => {
        try {
          const data = await logic.readTrainer(id);
          const token = await jwt.sign({ id }, JWT_SECRET, {
            expiresIn: "47m"
          });
          res.status(200).json({ token, data });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.delete("/trainer", auth, (req, res) => {
      const {
        userId: { id }
      } = req;
      return (async () => {
        try {
          await logic.deleteTrainer(id);
          res
            .status(200)
            .json({ message: "Trainer has been deleted successfully!" });
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      })();
    });

    app.put("/trainer", auth, (req, res) => {
      const {
        body,
        userId: { id }
      } = req;

      return (async () => {
        try {
          const data = await logic.updateTrainer(id, body);
          res.status(200).json({ data });
        } catch (err) {
          res.status(200).json({ error: err.message });
        }
      })();
    });

    app.get("/trainer/toggle/:pokemonId", auth, (req, res) => {
      const {
        userId: { id },
        params: { pokemonId }
      } = req;
      debugger;
      return (async () => {
        try {
          const data = await logic.togglePokemon(id, pokemonId);
          debugger;
          res.status(200).json({ data });
        } catch (err) {
          res.status(200).json({ error: err.message });
        }
      })();
    });

    app.use(function(req, res, next) {
      res.status(404).json({ error: "Not found." });
    });

    app.listen(PORT || 3030, function() {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
  }
})();
