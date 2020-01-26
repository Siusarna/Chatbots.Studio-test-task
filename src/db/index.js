const {createConnection} = require ('./createConnection');
const {updateOneDocInDb} = require ('./updateDocInDb');
const {readOneDocFromDb} = require ('./readDoc');
const {createDocInDb} = require ('./createDocInDb');
const {deleteOneDocFromDb} = require ('./deleteOneDocFromDb');

module.exports = {
    createConnection,
    createDocInDb,
    updateOneDocInDb,
    readOneDocFromDb,
    deleteOneDocFromDb
};