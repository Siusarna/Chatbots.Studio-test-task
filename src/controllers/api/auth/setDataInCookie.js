const parseConfig = (time) => {
    if (time.includes ('m')) {
        return time.slice (0, time.length - 1) * 60 * 1000; // minute convert to milisecond
    } else if (time.includes ('s')) {
        return time.slice (0, time.length - 1) * 1000; // second convert to milisecond
    }
};

module.exports = (res, name, token, expiresIn) => {
    res.cookie (name, token, {
        expires: new Date (Date.now () + parseConfig (expiresIn))
    });
};