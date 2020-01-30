const readDocFromDb = (model, filter, populateName) => {
  if (populateName) {
    return model.find(filter)
      .populate(populateName);
  }
  return model.find(filter);
};

module.exports = {
  readDocFromDb,
};
