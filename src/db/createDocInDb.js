const createDocInDb = async (model, data) => {
    const doc = new model (data);
    return doc.save ();
};

module.exports = {
    createDocInDb
};