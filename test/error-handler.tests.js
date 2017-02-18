'use strict';

const expect = require('chai').expect;
const constants = require('../lib/constants');
const errorHandler = require('../lib/error-handler');
const stubConsole = require('./stub-console');

function runTest(err, expected, done) {
    errorHandler(err, (err, data) => {
        if (err) {
            done(err);
            return;
        }

        try {
            expect(data).to.eql(expected);
            done();
        } catch (err) {
            done(err);
        }
    });
}

describe('error-handler', () => {
    beforeEach(() => stubConsole.stubError());
    afterEach(() => stubConsole.unstubError());

    it('should handle 500 error', done => {
        const err = new Error('[500] Some error');

        const expected = {
            statusCode: 500,
            headers: constants.corsHeaders,
            body: '{"error":"[500] Some error"}'
        };

        runTest(err, expected, done);
    });

    it('should handle 400 error', done => {
        const err = new Error('[400] Bad Request');

        const expected = {
            statusCode: 400,
            headers: constants.corsHeaders,
            body: '{"error":"[400] Bad Request"}'
        };

        runTest(err, expected, done);
    });

    it('should handle error with no status code', done => {
        const err = new Error('Bad Request');

        const expected = {
            statusCode: 500,
            headers: constants.corsHeaders,
            body: '{"error":"[500] Bad Request"}'
        };

        runTest(err, expected, done);
    });

    it('should handle error with no message', done => {
        const err = new Error('');

        const expected = {
            statusCode: 500,
            headers: constants.corsHeaders,
            body: '{"error":"[500] Unknown error"}'
        };

        runTest(err, expected, done);
    });

    it('should handle error with undefined message', done => {
        const err = new Error();

        const expected = {
            statusCode: 500,
            headers: constants.corsHeaders,
            body: '{"error":"[500] Unknown error"}'
        };

        runTest(err, expected, done);
    });

    it('should handle error with invalid status code', done => {
        const err = new Error('[foo] Bad Request');

        const expected = {
            statusCode: 500,
            headers: constants.corsHeaders,
            body: '{"error":"[500] [foo] Bad Request"}'
        };

        runTest(err, expected, done);
    });

    it('should handle conditional check failure error', done => {
        const err = new Error('Some message');
        err.code = 'ConditionalCheckFailedException';

        const expected = {
            statusCode: 400,
            headers: constants.corsHeaders,
            body: '{"error":"[400] Stale Data"}'
        };

        runTest(err, expected, done);
    });
});