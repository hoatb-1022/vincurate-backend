const { Label } = require('../models');

const getAllLabels = async () => {
  return Label.find({});
};

const getBioConceptLabels = async () => {
  return Promise.all(
    Label.bioConceptLabelsData().map(async (data) => {
      const newLabel = new Label(data);
      await newLabel.save();
    })
  );
};

module.exports = {
  getAllLabels,
  getBioConceptLabels,
};
