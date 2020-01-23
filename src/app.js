const express = require ('express');
const config = require ('./config/default');
const {createConnection} = require ('./db/index');

const app = express ();

const PORT = config.port || 3000;

const start = async () => {
    try {
        await createConnection ();
        app.listen (PORT, () => console.log (`App has been started on ${PORT}`));
    } catch (e) {
        console.log (e);
        process.exit (1);
    }
};

start ();