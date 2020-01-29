const isTime = (time) => {
    const [hour, minute] = time.split (':');
    return Number (hour) >= 0 && Number (hour) < 24 && Number (minute) >= 0 && Number (minute) < 60;
};

module.exports = isTime;