const deleteOneDocFromDb = async (model, filter) => {
    return model.deleteOne (filter);
};

module.exports = {
    deleteOneDocFromDb
};
