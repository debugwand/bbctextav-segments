const express = require('express');
const app = express();
const port = 3000;
const vttToJson = require('./vttToJson');
const nlp = require('./nlp');

app.get('/', async (req, res, next) => {
	const vttAsJson = await vttToJson();
	if (vttAsJson instanceof Error) {
		res.sendStatus(500);
	}
	const entities = nlp(vttAsJson);
	//TODO: send this to nlu to get entities
	//TODO: send off to cluster detection
	res.json(entities);
});

app.listen(port, () => { console.info(`I'm listening on port ${port}`); });
