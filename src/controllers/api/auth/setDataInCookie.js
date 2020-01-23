module.exports = (res, name, token, expiresIn) => {
    res.cookie (name, token, {
        expires: new Date (Date.now () + expiresIn)
    });
};