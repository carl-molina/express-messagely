"use strict";

const { SECRET_KEY } = require("../config");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const Router = require("express").Router;
const router = new Router();

/** POST /login: {username, password} => {token} */

router.post('/login', async function (req,res){
  if (req.body === undefined) throw new BadRequestError();
  const {username, password} = req.body;

  const user = User.authenticate(username, password);

  if (!user) {
    throw new UnauthorizedError('invalid username or password');
  }

  const token = jwt.sign({ username }, SECRET_KEY);

  return res.json({ token });
})


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

module.exports = router;