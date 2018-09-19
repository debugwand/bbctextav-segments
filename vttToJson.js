const vttToJson = require("vtt-to-json");
const fs = require('fs');

const readVTTFile = () => {
	return new Promise((resolve, reject) => {
		const vtt = fs.readFile('source/ft-money.vtt', {encoding: 'utf8'}, (err, data) => {
			return (err) ? reject(err) : resolve(data);
		});
	});
};

module.exports = () => {
	return readVTTFile()
		.then(data => {
			return vttToJson(data)
		})
		.then(result => {
			return result;
		})
		.catch(err => {
			console.error(err);
			return new Error(err);
		});
};
