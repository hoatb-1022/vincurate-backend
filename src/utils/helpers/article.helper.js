const {
  importArticleByJSONL,
  importArticleByCoNLL,
  importArticleByNER,
  importArticleByPlainText,
} = require('./importer.helper');
const { exportArticleInJSONL } = require('./exporter.helper');

async function importArticleFromFile(user, project, file, method) {
  const data = file.data.toString('utf-8');
  const dataSplited = data.split('\n');
  let result;

  switch (method) {
    case 'FORMAT_CONLL':
      result = await importArticleByCoNLL(user, project, data);
      break;
    case 'FORMAT_PLAIN':
      result = await importArticleByPlainText(user, project, dataSplited);
      break;
    case 'FORMAT_JSONL':
      result = await importArticleByJSONL(user, project, dataSplited);
      break;
    case 'FORMAT_NER':
    default:
      result = await importArticleByNER(user, project, data);
      break;
  }

  return result;
}

async function exportArticleInFile(article, method) {
  const result = {
    data: null,
    contentType: '',
    suffix: '',
  };

  switch (method) {
    case 'FORMAT_JSONL':
    default:
      result.data = await exportArticleInJSONL(article);
      result.contentType = 'text/plain';
      result.suffix = 'json';
      break;
  }

  return result;
}

const ArticleHelper = {
  importArticleFromFile,
  exportArticleInFile,
};

module.exports = ArticleHelper;
