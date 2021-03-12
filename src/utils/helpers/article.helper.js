const neatCsv = require('neat-csv');
const { Article, Unit, Annotation, Label } = require('../../models');
const { convertCONLLToJSONL, convertPlainTextToJSONL } = require('./converter.helper');

async function importSequenceLabelByJSONL(user, data, options) {
  const article = new Article();
  article.user = user.id;

  const mUnits = [];
  const mAnnotations = [];
  const mlabels = [];

  await Promise.all(
    data.map(async (line) => {
      const obj = typeof line === 'string' ? JSON.parse(line) : line;
      const { text, labels } = obj;
      const unit = new Unit();
      unit.text = options && options.formatter ? options.formatter(text) : text;
      unit.article = article.id;

      await Promise.all(
        labels.map(async (l) => {
          const annotation = new Annotation();
          const [offsetStart, offsetEnd, value] = l;
          annotation.offsetStart = offsetStart;
          annotation.offsetEnd = offsetEnd;
          annotation.unit = unit.id;
          annotation.user = user.id;

          let label = await Label.findOne({ value }).exec();
          if (!label) {
            label = new Label();
            label.value = value;
            label.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
          }

          annotation.label = label;
          mlabels.push(label);

          unit.annotations.push(annotation);
          mAnnotations.push(annotation);
        })
      );

      article.units.push(unit);
      mUnits.push(unit);
    })
  );

  return {
    article,
    units: mUnits,
    annotations: mAnnotations,
    labels: mlabels,
  };
}

async function importSequenceLabelByCoNLL(user, data, options) {
  let headers = ['text', 'label'];
  let separator = '\t';
  let lineSeparator = () => {};

  if (options && options.headers) headers = options.headers;
  if (options && options.separator) separator = options.separator;
  if (options && options.lineSeparator) lineSeparator = options.lineSeparator;

  const rows = await neatCsv(data, { headers, separator });
  const jsonlData = convertCONLLToJSONL(rows, lineSeparator);
  const result = await importSequenceLabelByJSONL(user, jsonlData, options);

  return result;
}

async function importSequenceLabelByNER(user, data) {
  const headers = ['senIndex', 'text', 'posTag', 'label', 'parent', 'relation'];
  const result = await importSequenceLabelByCoNLL(user, data, {
    headers,
    separator: ',',
    lineSeparator(row, rows, index) {
      return index === rows.length - 1 || rows[index + 1].senIndex === '1';
    },
    formatter(text) {
      const regex = /(.+)_(.+)/g;
      while (text.match(regex)) {
        // eslint-disable-next-line no-param-reassign
        text = text.replace(regex, '$1 $2').trim();
      }
      return text;
    },
  });

  return result;
}

async function importSequenceLabelByPlainText(user, data) {
  const jsonlData = convertPlainTextToJSONL(data);
  const result = await importSequenceLabelByJSONL(user, jsonlData);

  return result;
}

async function importArticleFromFile(user, file, method) {
  const data = file.data.toString('utf-8');
  const dataSplited = data.split('\n');
  let result;

  switch (method) {
    case 'SL_CONLL':
      result = await importSequenceLabelByCoNLL(user, data);
      break;
    case 'SL_NER':
      result = await importSequenceLabelByNER(user, data);
      break;
    case 'SL_PLAIN':
      result = await importSequenceLabelByPlainText(user, dataSplited);
      break;
    case 'SL_JSONL':
    default:
      result = await importSequenceLabelByJSONL(user, dataSplited);
      break;
  }

  return result;
}

const ArticleHelper = {
  importArticleFromFile,
};

module.exports = ArticleHelper;
