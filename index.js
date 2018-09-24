const express = require('express');
const app = express();
const port = 3000;
const vttToJson = require('./vttToJson');
const nlp = require('./nlp');
const categoryClusters = require('category-clusters');

app.get('/', async (req, res, next) => {
	const vttAsJson = await vttToJson();
	if (vttAsJson instanceof Error) {
		res.sendStatus(500);
	}
	const entities = await nlp(vttAsJson);
	if (entities instanceof Error) {
		res.sendStatus(500);
	}
	//todo: can we await this?
	categoryClusters(entities, {
		neighbourThreshold: 4000
	})
		.then(results => {
			results.clusters.forEach(result => {
				result.topics = result.topics.map(topic => { //sorry
					return topic.substring(topic.lastIndexOf('/')+1);
				});
			});
			res.json(results);
		})
		.catch(err => {
			console.error(err);
			res.sendStatus(500);
		})
});

app.listen(port, () => { console.info(`I'm listening on port ${port}`); });
