const express = require('express');
const router = express.Router();

module.exports = function (sequelize) {

  Room = require('../models/roomModel')(sequelize);

  router.get('/', async function(req, res) {
    try {
      rooms = await Room.findAll();
      console.info('Fetching all rooms.');
      res.send(rooms);
    } catch (ex) {
      console.error(ex);
      next('Error while fetching all rooms.');
    }
  });

  router.get('/:id', async function(req, res) {
    try {
      room = await Room.findOne({
        where: {
          id: req.params.id
        }
      });
      console.info('Fetching specific room.');
      res.send(room.toJSON());
    } catch (ex) {
      console.error(ex);
      next('Error while fetching specific room.');
    }
  });

  router.post('/', async function(req, res) {
    try {
      room = await Room.create({
        location: req.body.location,
        format: req.body.format,
        language: req.body.language,
      });
      console.info('Creating new room.');
      res.send(room.toJSON());
    } catch (ex) {
      console.error(ex);
      next('Error while creating new room.');
    }
  });

  router.put('/:id', async function(req, res) {
    try {
      Room.update({
        location: req.body.location,
        format: req.body.format,
        language: req.body.language,
      }, {
        where: {
          id: req.params.id
        }
      })
      .then((room, err) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          console.info('Updating room.');
          res.send(room);
        }
      });
    } catch (ex) {
      console.error(ex);
      next('Error while creating new room.');
    }
  });

  router.delete('/:id', async function(req, res) {
    try {
      Room.destroy({
        where: {
          id: req.params.id
        }
      })
      .then((room, err) => {
        if (err) {
          console.log(err);
          next(err);
        } else {
          console.info('Deleting room.');
          console.log(room);
          res.send('Deleted room.');
        }
      });
    } catch (ex) {
      console.error(ex);
      next('Error while creating new room.');
    }
  });

  return router;
};
