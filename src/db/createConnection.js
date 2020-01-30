const mongoose = require('mongoose');
const config = require('../config/default');

const createConnection = async () => {
  await mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

module.exports = {
  createConnection,
};
