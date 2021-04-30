function formatTextSpaces(text, nextText, prevText, isStart, isEnd) {
  const noBeforeSpaceCharacters = ['.', ',', ':', ')', '}', ']', '"', "'", ';', '“'];
  const noAfterSpaceCharacters = ['(', '[', '{', '"', "'"];
  let after = ' ';
  if (isEnd || noBeforeSpaceCharacters.includes(nextText) || noAfterSpaceCharacters.includes(text)) after = '';

  return text + after;
}

function convertCONLLToJSONL(data, lineSeparator) {
  const newData = [];
  let jsonlLine = {
    text: '',
    labels: [],
  };
  let currentType = 'O';
  let offsetStart = 0;

  // Loops though data
  data.forEach((conllLine, index) => {
    const isEndOfData = index === data.length - 1;
    const isGoodCollData = conllLine && conllLine.text && conllLine.label;

    if (isGoodCollData) {
      const splitIndex = conllLine.label.indexOf('-');
      const type = conllLine.label === 'O' ? 'O' : conllLine.label.substring(splitIndex + 1);

      // When type changed/end of data
      if (currentType !== type) {
        if (currentType !== 'O') jsonlLine.labels.push([offsetStart, jsonlLine.text.trim().length, currentType]);

        currentType = type;
        offsetStart = jsonlLine.text.length;
      }

      jsonlLine.text += formatTextSpaces(
        conllLine.text,
        data[index + 1] ? data[index + 1].text : '',
        data[index - 1] ? data[index - 1].text : '',
        index === 0,
        index === data.length - 1
      );

      // When end of data but the last one has concept
      if (isEndOfData && currentType !== 'O') jsonlLine.labels.push([offsetStart, jsonlLine.text.length, currentType]);
    }

    // When reach line separator/end of sentence/end of data
    if (!isGoodCollData || lineSeparator(conllLine, data, index) || isEndOfData) {
      if (jsonlLine.text.length) newData.push(jsonlLine);
      jsonlLine = {
        text: '',
        labels: [],
      };
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
      });
  });

  return newData;
}

const ConverterHelper = {
  convertCONLLToJSONL,
  convertPlainTextToJSONL,
};

module.exports = ConverterHelper;
