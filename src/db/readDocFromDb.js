const readDocFromDb = (model, filter) => {
    return model.find (filter);
};

module.exports = {
    readDocFromDb
};