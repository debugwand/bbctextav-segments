// CAVEAT there will be nicer ways of doing this, time limits for a hackday
// e.g. might have been nicer to use Map or Set and have a reference to link chunks to original json array items

const NLU = require('watson-developer-cloud/natural-language-understanding/v1.js');
require('dotenv').config();

const nlu = new NLU({
  'username': process.env.WATSON_USR,
  'password': process.env.WATSON_PWD,
  'version': '2018-03-16'
});

const topCategory = (categories) => {
	const sorted = categories.sort((a,b) => {
		if (!a.score || !b.score) {
			throw new Error('No score property found');
		}
		return b.score - a.score;
	});
	return sorted[0] && sorted[0].label;
};

const analyze = (text) => {
	const parameters = {
		text,
		features: {
			categories: {}
		}
	};
	return new Promise((resolve, reject) => {
		nlu.analyze(parameters, (err, response) => {
			if (err) {
				console.log('error:', err);
				reject(err);
			}
			resolve(response);
		});
	});
};


const getText = (vttAsJson) => {
	const justText = vttAsJson.map(items => {
		return items.part;
	});
	return justText;
}

const splitChunks = (vttText) => {
	const chunks = [];
	do {
		const chunkParts = vttText.splice(0, 10);
		const chunk = chunkParts.join(' ');
		chunks.push(chunk);
	} while (vttText.length);
	return chunks;
};

// const addCategoryToVTTJson = ({chunk, topCategoryName, vttText}) => {
const addCategoryToVTTJson = (vttAsJson, topCategoryName, index) => {
	const start = index * 10;
	const end = start + 10;
	for (let i = start; i < end; i += 1) {
		if (vttAsJson[i]) {
			vttAsJson[i].topic = topCategoryName;
		}
	}
	return vttAsJson;
};

module.exports = async (vttAsJson) => {
	const vttText = getText(vttAsJson);
	const chunks = splitChunks(vttText);
	//cant' know when we have the last one done. promise all?
	const analysedChunks = chunks.map(chunk => {
		return analyze(chunk);
	});
	return Promise.all(analysedChunks)
		.then(analysedTexts => {
			analysedTexts.forEach((analysedText, index) => {
				if (analysedText && analysedText.categories) {
					const topCategoryName = topCategory(analysedText.categories);
					addCategoryToVTTJson(vttAsJson, topCategoryName, index);
				}
			})
			console.log(vttAsJson)
			return vttAsJson;
		})
		.catch (err => {
			console.error(err);
			return new Error(err);
	});
};
