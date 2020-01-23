const readOneDocFromDb = (model, filter) => {
    return model.findOne (filter);
};

module.exports = {
    readOneDocFromDb
};