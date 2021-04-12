async function exportArticleInJSONL(article) {
  const result = {
    text: article.content,
  };

  if (article.annotations) {
    result.labels = [];
    article.annotations.forEach((anno) => {
      result.labels.push([anno.offsetStart, anno.offsetEnd, anno.label.value]);
    });
  }

  if (article.categories) {
    result.categories = [];
    article.categories.forEach((c) => {
      result.categories.push(c.value);
    });
  }

  if (article.translation) {
    result.translation = article.translation.content;
  }

  return result;
}

const ExporterHelper = {
  exportArticleInJSONL,
};

module.exports = ExporterHelper;
