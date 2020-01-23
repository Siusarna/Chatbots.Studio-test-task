const express = require ('express');
const config = require ('./config/default');
const {createConnection} = require ('./db/index');

const app = express ();
app.use (express.json ());
require ('./routers/index') (app);

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

app.get ('/', (req, res) => {
    res.sendFile (__dirname + '/index.html');
});

start ();