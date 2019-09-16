require("dotenv").config();
const jwt = require("jsonwebtoken");

const {
  env: { JWT_SECRET }
} = process;

module.exports = (req, res, next) => {
  return Promise.resolve().then(() => {
    const {
      headers: { authorization }
    } = req;

    if (!authorization) throw new Error('There is no authorization.');

    const token = authorization.slice(7);
    const { id: sub } = jwt.verify(token, JWT_SECRET);
    req.userId = sub;
    next();
  });
};
