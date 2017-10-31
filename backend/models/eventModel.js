'use strict';

const Sequelize = require('sequelize');

module.exports = function (sequelize) {

	return sequelize.define('events', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		institution: {
			type: Sequelize.STRING,
		},
		type: {
			type: Sequelize.STRING,
		},
		status: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: 'OPEN',
		},
		date: {
			type: Sequelize.DATE,
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	});
};
