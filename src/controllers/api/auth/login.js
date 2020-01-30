const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { getAndUpdateTokens } = require('../../../helpers/auth/index');
const config = require('../../../config/default');
const { readOneDocFromDb } = require('../../../db/index');
const setDataInCookie = require('../../setDataInCookie');
require('../../../models/index');

const User = mongoose.model('User');

const matchInputDataWithDbData = async (inputEmail, inputPassword, dataFromDb) => {
  if (!dataFromDb) {
    return false;
  }
  return (await bcrypt.compare(inputPassword, dataFromDb.password) && inputEmail === dataFromDb.email);
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await readOneDocFromDb(User, { email });
    if (!await matchInputDataWithDbData(email, password, user)) {
      return res.status(400)
        .json({ message: 'Incorrect login or password' });
    }

    const { accessToken, refreshToken } = await getAndUpdateTokens(user._id);
    setDataInCookie(res, 'accessToken', accessToken, config.jwt.tokens.access.expiresIn);
    setDataInCookie(res, 'refreshToken', refreshToken, config.jwt.tokens.refresh.expiresIn);
    return res.send('ok');
  } catch (e) {
    return res.status(500)
      .json({ message: 'Something went wrong' });
  }
};

module.exports = {
  login,
};
