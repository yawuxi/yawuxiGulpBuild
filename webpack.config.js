'use strict';

let path = require('path');

module.exports = {
	mode: 'development',
	devtool: 'source-map',

	output: {
		filename: 'bundle.js',
	},

	module: {
		rules: [{
			test: /\.m?js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
			}
		}]
	}
};