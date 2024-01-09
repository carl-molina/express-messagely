"use strict";

const Router = require("express").Router;
const router = new Router();
const Message= require('../models/message');
const { ensureLoggedIn, ensureCorrectUser, ensureCorrectRecipient } = require('../middleware/auth');
const { UnauthorizedError, NotFoundError } = require("../expressError");

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
 **/

router.get('/:id', ensureLoggedIn, ensureCorrectUser, async function (req, res) {

  const currUser = res.locals.user;
  const message = await Message.get(req.params.id);

  if (message.from_user.username !== currUser.username ||
    message.to_user.username !== currUser.username) {
      throw new UnauthorizedError('User not from_user or to_user');
    }

  return res.json({ message });
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureLoggedIn, async function(req, res) {

  const from_username = res.locals.user.username;
  const { to_username, body } = req.body;

  console.log('from_username=', from_username, 'to_username=,', to_username, "body=",body)


  let message;
  try {
    message = await Message.create({from_username, to_username, body});
  } catch (err) {
    console.log(err);
    // throw new NotFoundError('Receipient not founnd.');
  }

  return res.json({ message });
})



/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only intended recipient can mark as read.
 *
 **/

router.post('/:id/read', ensureLoggedIn, ensureCorrectUser, async function(req, res){

  const currUser = res.locals.user;
  const message = await Message.get(req.params.id);

  if (message.to_user.username !== currUser.username) {
    throw new UnauthorizedError('Cannot mark message as read.');
  }

  await Message.markRead(message.id);

  return res.json({ message });

})


module.exports = router;