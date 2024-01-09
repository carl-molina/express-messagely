"use strict";

const Router = require("express").Router;
const router = new Router();
const { Message, markRead } = require('../models/message');
const { ensureCorrectUser, ensureCorrectRecipient } = require('../middleware/auth');

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Makes sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', ensureCorrectUser, ensureCorrectRecipient, async function (req, res) {

  const message = await Message.get(req.params.id);
  return res.json({ message });
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureCorrectUser, async function(req, res) {

  const currUser = res.locals.user;

  const {to_username, body} = req.body;

  const message = Message.create(currUser.username, to_username, body);

  return res.json({ message });
})



/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', ensureCorrectUser, async function(req, res){
  message = req.params.id;

  await Message.markRead(message);




})


module.exports = router;