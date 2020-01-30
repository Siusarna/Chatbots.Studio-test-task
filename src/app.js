/* eslint-disable no-console */
const express = require('express');
const cookieParser = require('cookie-parser');
const config = require('./config/default');
const { createConnection } = require('./db/index');

const app = express();
app.use(cookieParser());
app.use(express.json());
require('./routers/index')(app);

const PORT = config.port || 3000;

const start = async () => {
  try {
    await createConnection();
    app.listen(PORT, () => console.log(`App has been started on ${PORT}`));
  } catch (e) {
    process.exit(1);
  }
};

start();
