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

// there will be nicer ways of doing this, time limits for a hackday
const splitChunks = (vttAsJson) => {
	const chunks = [];
	const justText = vttAsJson.map(items => {
		return items.part;
	});
	do {
		const chunkParts = justText.splice(0, 10);
		const chunk = chunkParts.join(' ');
		chunks.push(chunk);
	} while (justText.length);
	return chunks;
};

module.exports = async (vttAsJson) => {
	const chunks = splitChunks(vttAsJson);
	chunks.forEach(async (chunk) => {
		try {
			const analysedText = await analyze(chunk);
			if (analysedText && analysedText.categories) {
				const topCategoryName = topCategory(analysedText.categories);
				//now need to add this back to original part
			}
		}
		catch (err) {
			console.error(err);
			return new Error(err);
		}
	});
	return 'asf';
};
