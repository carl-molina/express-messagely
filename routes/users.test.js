'use strict';

const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");

beforeAll(function () {
  db.User.register({
    test:"test", password:"password", first:"test", last:'lastname', phone:1234567})
})


describe('GET / users')