const updateOneDocInDb = async (model, filter, update) => model.findOneAndUpdate(filter, update, {
  new: true,
});

module.exports = {
  updateOneDocInDb,
};
