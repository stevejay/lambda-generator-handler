'use strict';

const expect = require('chai').expect;
const log = require('loglevel');
const sinon = require('sinon');
const constants = require('../lib/constants');
const generatorHandler = require('../lib/generator-handler');

function runTest(handler, event, expected, done) {
    generatorHandler(handler)(event, null, (err, data) => {
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

describe('lambda-generator-handler', () => {
    beforeEach(() => sinon.stub(log, 'error').callsFake(() => {}));
    afterEach(() => log.error.restore());

    it('should run a handler that returns successfully', done => {
        const handler = function*() { // eslint-disable-line require-yield
            return { name: 'return value' };
        };

        const expected = {
            statusCode: 200,
            headers: constants.corsHeaders,
            body: '{"name":"return value"}'
        };

        runTest(handler, 'some event', expected, done);
    });

    it('should run a handler that returns null', done => {
        const handler = function*() { // eslint-disable-line require-yield
            return null;
        };

        const expected = {
            statusCode: 200,
            headers: constants.corsHeaders,
            body: null
        };

        runTest(handler, 'some event', expected, done);
    });

    it('should run a handler that throws an error', done => {
        const handler = function*() { // eslint-disable-line require-yield
            throw new Error('[500] Some error');
        };

        const expected = {
            statusCode: 500,
            headers: constants.corsHeaders,
            body: '{"error":"[500] Some error"}'
        };

        runTest(handler, 'some event', expected, done);
    });
});
