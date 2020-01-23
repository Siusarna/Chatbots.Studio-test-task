const createDocInDb = async (model, data) => {
    const doc = new model (data);
    await doc.save;
};

module.exports = {
    createDocInDb
};