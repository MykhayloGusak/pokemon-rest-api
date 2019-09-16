# Pokemon REST Api

![Joke](img/image.jpg)

## Introductin

TO DO

## Available Scripts for development

In the project directory, you can run:

### `node index.js`

Runs the server. <br>
Open [http://localhost:3030](http://localhost:3030).

### `npm test logic/index.spec.js`

Launches the test runner in the interactive watch mode.

## Trello organization

[Trello](https://trello.com/b/PWzq9Qir/pokemon-rest-api)

## Pokemon routes

| POKEMONS                    | Method | Path                 | Returns        |
| --------------------------- | ------ | -------------------- | -------------- |
| Create pokemon              | POST   | /pokemon             | Object         |
| Read pokemon                | GET    | /pokemon/:name       | Object         |
| Update pokemon              | PUT    | /pokemon/:name       | Updated Object |
| Delete pokemon              | DELETE | /pokemon/:name       | Message        |
| Read all pokemons           | GET    | /pokemons            | Array          |
| Read the number of pokemons | GET    | /pokemons/registered | Array          |

## Trainer routes

| Trainers                                       | Method | Token | Path                       | Returns        |
| ---------------------------------------------- | ------ | ----- | -------------------------- | -------------- |
| Create trainer                                 | POST   | ✖     | /trainer/create            | Token          |
| Auth trainer                                   | POST   | ✖     | /trainer/auth              | Token          |
| Read trainer                                   | GET    | ✔     | /trainer                   | Object         |
| Update trainer                                 | PUT    | ✔     | /trainer                   | Updated Object |
| Delete trainer                                 | DELETE | ✔     | /trainer                   | Message        |
| Read all trainers                              | GET    | ✔     | /trainers                  | Array          |
| Read firstName and number of caputerd pokemons | GET    | ✔     | /trainers/all              | Array          |
| Toggle pokemon to captured list                | GET    | ✔     | /trainer/toggle/:pokemonId | Object         |

## Testing

![Testing 1](img/testing1.PEG)
![Testing 2](img/testing2.PEG)
![Testing 3](img/testing3.PEG)

## Coverage

TO DO