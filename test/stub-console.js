'use strict';

const sinon = require('sinon');

module.exports.stubError = () => sinon.stub(console, 'error', () => {});

module.exports.unstubError = () => console.error.restore(); // eslint-disable-line no-console
