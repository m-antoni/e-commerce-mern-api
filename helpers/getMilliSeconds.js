
const getMilliSeconds = function (startTime) {
    const responseTimeMs = Date.now() - startTime;
    return parseFloat(responseTimeMs.toFixed(3));
}

module.exports = getMilliSeconds;