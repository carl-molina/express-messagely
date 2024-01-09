"use strict";

const { SECRET_KEY, JWT_OPTIONS } = require("../config");
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

router.post('/register', async function (req, res){

  if (req.body === undefined) throw new BadRequestError();
  const {username, password, first_name, last_name, phone} = req.body;

  const newUser = User.register(username, password, first_name, last_name, phone);

  return jwt.sign(newUser, SECRET_KEY, JWT_OPTIONS);
})

module.exports = router;