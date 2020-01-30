const createDocInDb = async (Model, data) => {
  const doc = new Model(data);
  return doc.save();
};

module.exports = {
  createDocInDb,
};
