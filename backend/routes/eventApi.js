const express = require('express');
const router = express.Router();

module.exports = function (sequelize) {

	Event = require('../models/eventModel')(sequelize);

	router.get('/', async function(req, res) {
		try {
			events = await Event.findAll();
			console.info('Fetching all events.');
			res.send(events);
		} catch (ex) {
		    console.error(ex);
			next('Error while fetching all events.');
		}
	});

	router.get('/:id', async function(req, res) {
		try {
			event = await Event.findOne({
				where: {
					id: req.params.id
				}
			});
			console.info('Fetching specific event.');
			res.send(event.toJSON());
		} catch (ex) {
		    console.error(ex);
			next('Error while fetching specific event.');
		}
	});

	router.post('/', async function(req, res) {
		try {
			event = await Event.create({
				institution: req.body.institution,
				type: req.body.type,
			});
			console.info('Creating new event.');
			res.send(event.toJSON());
		} catch (ex) {
		    console.error(ex);
		    next('Error while creating new event.');
		}
	});

	router.put('/:id', async function(req, res) {
		try {
			Event.update({
				institution: req.body.institution,
				type: req.body.type,
			}, {
				where: {
					id: req.params.id
				}
			})
			.then((event, err) => {
				if (err) {
					console.log(err);
					next(err);
				} else {
					console.info('Updating event.');
					res.send(event);
				}
			});
		} catch (ex) {
		    console.error(ex);
		    next('Error while creating new event.');
		}
	});

	router.delete('/:id', async function(req, res) {
		try {
			Event.destroy({
				where: {
					id: req.params.id
				}
			})
			.then((event, err) => {
			    if (err) {
			        console.log(err);
			        next(err);
			    } else {
					console.info('Deleting event.');
					console.log(event);
					res.send('Deleted event.');
				}
			});
		} catch (ex) {
		    console.error(ex);
		    next('Error while creating new event.');
		}
	});

	return router;
};
