const readOneDocFromDb = (model, filter, populateName) => {
  if (populateName) {
    return model.findOne(filter)
      .populate(populateName);
  }
  return model.findOne(filter);
};

module.exports = {
  readOneDocFromDb,
};
