const express = require('express');
const router = express.Router();

module.exports = function (sequelize) {

  User = require('../models/userModel')(sequelize);
  Room = require('../models/roomModel')(sequelize);
  Event = require('../models/eventModel')(sequelize);
  User.belongsTo(Event); // adds eventId to user model
  User.belongsTo(Room); // adds roomId to user model

  router.get('/', async function(req, res) {
    try {
      users = await User.findAll();
      console.info('Fetching all users.');
      res.send(users);
    } catch (ex) {
      console.error(ex);
      next('Error while fetching all users.');
    }
  });

  router.get('/:id', async function(req, res) {
    try {
      user = await User.findOne({
        where: {
          id: req.params.id
        }
      });
      console.info('Fetching specific user.');
      res.send(user.toJSON());
    } catch (ex) {
      console.error(ex);
      next('Error while fetching specific user.');
    }
  });

  router.get('/byEvent/:eventId', async function(req, res) {
    try {
      users = await User.findAll({
        where: {
          eventId: req.params.eventId
        }
      });
      console.info('Fetching specific user.');
      res.send(users);
    } catch (ex) {
      console.error(ex);
      next('Error while fetching specific user.');
    }
  });

  router.post('/', async function(req, res) {
    try {
      user = await User.create({
        name: req.body.name,
        role: req.body.role,
        format: req.body.format,
        language: req.body.language,
        eventId: req.body.eventId,
        roomId: req.body.roomId,
        position: req.body.position,
      });
      console.info('Creating new user.');
      res.send(user.toJSON());
    } catch (ex) {
      console.error(ex);
      next('Error while creating new user.');
    }
  });

  router.put('/:id', async function(req, res) {
    try {
      User.update({
        name: req.body.name,
        role: req.body.role,
        format: req.body.format,
        language: req.body.language,
        eventId: req.body.eventId,
        roomId: req.body.roomId,
        position: req.body.position,
      }, {
        where: {
          id: req.params.id
        }
      })
      .then((user, err) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          console.info('Updating user.');
          res.send(user);
        }
      });
    } catch (ex) {
      console.error(ex);
      next('Error while creating new user.');
    }
  });

  router.delete('/:id', async function(req, res) {
    try {
      User.destroy({
        where: {
          id: req.params.id
        }
      })
      .then((user, err) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          console.info('Deleting user.');
          console.log(user);
          res.send('Deleted user.');
        }
      });
    } catch (ex) {
      console.error(ex);
      next('Error while creating new user.');
    }
  });

  return router;
};
