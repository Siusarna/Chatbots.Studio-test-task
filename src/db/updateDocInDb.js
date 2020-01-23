const updateOneDocInDb = async (model, filter, update) => {
    return model.findOneAndUpdate (filter, update, {
        new: true
    });
};

module.exports = {
    updateOneDocInDb
};
