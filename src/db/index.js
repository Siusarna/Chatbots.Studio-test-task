const { createConnection } = require('./createConnection');
const { updateOneDocInDb } = require('./updateDocInDb');
const { readOneDocFromDb } = require('./readOneDocFromDb');
const { createDocInDb } = require('./createDocInDb');
const { deleteOneDocFromDb } = require('./deleteOneDocFromDb');
const { readDocFromDb } = require('./readDocFromDb');

module.exports = {
  createConnection,
  createDocInDb,
  updateOneDocInDb,
  readOneDocFromDb,
  readDocFromDb,
  deleteOneDocFromDb,
};
