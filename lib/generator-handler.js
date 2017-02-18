'use strict';

const co = require('co');
const errorHandler = require('./error-handler');
const constants = require('./constants');

module.exports = exports = function(handler) {
    return function(event, context, cb) {
        co(function*() {
            const handlerResult = yield handler(event);
            const body = handlerResult == null ? null : JSON.stringify(handlerResult);

            const result = {
                statusCode: 200,
                headers: constants.corsHeaders,
                body
            };

            cb(null, result);
        }).catch(err => errorHandler(err, cb));
    };
};
