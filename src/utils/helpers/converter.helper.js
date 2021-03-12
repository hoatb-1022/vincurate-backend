function convertCONLLToJSONL(data, lineSeparator) {
  const newData = [];
  let jsonlLine = {
    text: '',
    labels: [],
  };
  let texts = [];
  let currentType = 'O';
  let offsetStart = 0;

  // Loops though data
  data.forEach((conllLine, index) => {
    const isEndOfData = index === data.length - 1;

    if (conllLine && conllLine.text) {
      const splitIndex = conllLine.label.indexOf('-');
      const type = conllLine.label === 'O' ? 'O' : conllLine.label.substring(splitIndex + 1);

      // When type changed/end of data
      if (currentType !== type || isEndOfData) {
        if (currentType !== 'O') jsonlLine.labels.push([offsetStart, jsonlLine.text.length, currentType]);

        currentType = type;
        offsetStart = jsonlLine.text.length;
      } else if (!currentType.length) {
        currentType = type;
        offsetStart = jsonlLine.text.length;
      }

      texts.push(conllLine.text);
      jsonlLine.text = texts.join(' ');
    }

    // When reach line seperator/end of sentence/end of data
    if (!conllLine || !conllLine.text || lineSeparator(conllLine, data, index) || isEndOfData) {
      if (jsonlLine.text.length) newData.push(jsonlLine);
      jsonlLine = {
        text: '',
        labels: [],
      };
      texts = [];
      currentType = 'O';
    }
  });

  return newData;
}

function convertPlainTextToJSONL(data) {
  const newData = [];

  // Loops though data
  data.forEach((plainLine) => {
    if (plainLine.length)
      newData.push({
        text: plainLine,
        labels: [],
      });
  });

  return newData;
}

const ConverterHelper = {
  convertCONLLToJSONL,
  convertPlainTextToJSONL,
};

module.exports = ConverterHelper;
