'use strict';

const log = require('loglevel');
const constants = require('./constants');

const ERROR_CODE_REGEX = /^\[(\d\d\d)\]/;

module.exports = exports = function(err, cb) {
    let statusCode = null;

    log.error(err);

    if (err.code === 'ConditionalCheckFailedException') {
        err.message = '[400] Stale Data';
        statusCode = 400;
    } else {
        const errorCodeMatch = (err.message || '').match(ERROR_CODE_REGEX);

        if (!errorCodeMatch) {
            err.message = '[500] ' + (err.message || 'Unknown error');
            statusCode = 500;
        } else {
            statusCode = parseInt(errorCodeMatch[1]);
        }
    }

    const body = JSON.stringify({ error: err.message });

    const result = {
        statusCode,
        headers: constants.corsHeaders,
        body
    };

    cb(null, result);
};
