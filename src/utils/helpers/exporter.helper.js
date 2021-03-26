async function exportSequenceLabelInJSONL(article) {
  const result = {
    text: article.content,
    labels: [],
  };
  article.annotations.forEach((anno) => {
    result.labels.push([anno.offsetStart, anno.offsetEnd, anno.label.value]);
  });

  return result;
}

const ExporterHelper = {
  exportSequenceLabelInJSONL,
};

module.exports = ExporterHelper;
