const parseConfig = (time) => {
  let result;
  if (time.includes('m')) {
    result = time.slice(0, time.length - 1) * 60 * 1000; // minute convert to milisecond
  }
  if (time.includes('s')) {
    result = time.slice(0, time.length - 1) * 1000; // second convert to milisecond
  }
  return result;
};

module.exports = (res, name, token, expiresIn) => {
  res.cookie(name, token, {
    expires: new Date(Date.now() + parseConfig(expiresIn)),
  });
};
