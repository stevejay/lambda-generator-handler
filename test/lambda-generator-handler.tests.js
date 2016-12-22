'use strict';

const generatorHandler = require('../index');

describe('lambda-generator-handler', function() {
    it('should run a handler that does not throw', function(done) {
        const handler = function*() { return 'return value'; }; // eslint-disable-line require-yield

        const cb = (err, data) => {
            if (err) {
                done(err);
            } else {
                if (data === 'return value') {
                    done();
                } else {
                    done(new Error('incorrect return value'));
                }
            }
        };

        generatorHandler(handler)('some event', null, cb);
    });

    it('should run a handler that throws an error that already has an error code message prefix', function(done) {
        const handler = function*() { throw new Error('[503] Error'); }; // eslint-disable-line require-yield

        const cb = err => {
            if (err) {
                if (err.message === '[503] Error') {
                    done();
                } else {
                    done(new Error(`incorrect error message: ${err.message}`));
                }
            } else {
                done(new Error('An error should have been returned from the handler'));
            }
        };

        generatorHandler(handler)('some event', null, cb);
    });

    it('should run a handler that throws an error that does not have an error code message prefix', function(done) {
        const handler = function*() { throw new Error('My Error'); }; // eslint-disable-line require-yield

        const cb = err => {
            if (err) {
                if (err.message === '[500] My Error') {
                    done();
                } else {
                    done(new Error(`incorrect error message: ${err.message}`));
                }
            } else {
                done(new Error('An error should have been returned from the handler'));
            }
        };

        generatorHandler(handler)('some event', null, cb);
    });

    it('should run a handler that throws a stale data exception', function(done) {
        const handler = function*() { // eslint-disable-line require-yield
            const err = new Error('Some Error');
            err.code = 'ConditionalCheckFailedException';
            throw err;
        };

        const cb = err => {
            if (err) {
                if (err.message === '[400] Stale Data') {
                    done();
                } else {
                    done(new Error(`incorrect error message: ${err.message}`));
                }
            } else {
                done(new Error('An error should have been returned from the handler'));
            }
        };

        generatorHandler(handler)('some event', null, cb);
    });
});
