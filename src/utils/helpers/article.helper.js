const {
  importSequenceLabelByJSONL,
  importSequenceLabelByCoNLL,
  importSequenceLabelByNER,
  importSequenceLabelByPlainText,
} = require('./importer.helper');
const { exportSequenceLabelInJSONL } = require('./exporter.helper');

async function importArticleFromFile(user, project, file, method) {
  const data = file.data.toString('utf-8');
  const dataSplited = data.split('\n');
  let result;

  switch (method) {
    case 'SL_CONLL':
      result = await importSequenceLabelByCoNLL(user, project, data);
      break;
    case 'SL_PLAIN':
      result = await importSequenceLabelByPlainText(user, project, dataSplited);
      break;
    case 'SL_JSONL':
      result = await importSequenceLabelByJSONL(user, project, dataSplited);
      break;
    case 'SL_NER':
    default:
      result = await importSequenceLabelByNER(user, project, data);
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
    case 'SL_JSONL':
    default:
      result.data = await exportSequenceLabelInJSONL(article);
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
