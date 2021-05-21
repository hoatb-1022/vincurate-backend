const axios = require('axios');
const flatten = require('lodash/flatten');
const { importArticleByMLData } = require('./importer.helper');

async function getVnCoreNLPData(text) {
  const params = new URLSearchParams();
  params.append('text', text);
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  const suggestResults = await axios.post('http://localhost:9000/handle', params, config);

  return flatten(suggestResults.data.sentences);
}

async function doSuggestions(article, user) {
  const suggestions = await getVnCoreNLPData(article.content);
  const { article: finalArticle } = await importArticleByMLData(user, article.project, suggestions);

  return finalArticle;
}

const MLHelper = {
  doSuggestions,
};

module.exports = MLHelper;
