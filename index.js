'use strict';

const co = require('co');

module.exports = exports = function(handler) {
    return function(event, context, cb) {
        co(function*() {
            const result = yield handler(event);
            cb(null, result);
        }).catch(err => _errorHandler(cb, err));
    };
};

const ERROR_CODE_REGEX = /^\[\d\d\d\]/;

function _errorHandler(cb, err) {
    if (err.code === 'ConditionalCheckFailedException') {
        err.message = '[400] Stale Data';
    } else if (!ERROR_CODE_REGEX.test(err.message)) {
        err.message = '[500] ' + err.message;
    }

    cb(err);
}
