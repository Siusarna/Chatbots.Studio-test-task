const deleteOneDocFromDb = async (model, filter) => model.deleteOne(filter);

module.exports = {
  deleteOneDocFromDb,
};
