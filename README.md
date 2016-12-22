# lambda-generator-handler

Run a generator function as an AWS Lambda function,  with added error handling

[![npm version](https://badge.fury.io/js/lambda-generator-handler.svg)](https://badge.fury.io/js/lambda-generator-handler)
[![Codeship Status for stevejay/lambda-generator-handler](https://app.codeship.com/projects/6cc5dcf0-aa06-0134-4024-3e211d17d664/status?branch=master)](https://app.codeship.com/projects/191800)
[![Coverage Status](https://coveralls.io/repos/github/stevejay/lambda-generator-handler/badge.svg?branch=master)](https://coveralls.io/github/stevejay/lambda-generator-handler?branch=master)
[![bitHound Overall Score](https://www.bithound.io/github/stevejay/lambda-generator-handler/badges/score.svg)](https://www.bithound.io/github/stevejay/lambda-generator-handler)
[![bitHound Dependencies](https://www.bithound.io/github/stevejay/lambda-generator-handler/badges/dependencies.svg)](https://www.bithound.io/github/stevejay/lambda-generator-handler/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/stevejay/lambda-generator-handler/badges/devDependencies.svg)](https://www.bithound.io/github/stevejay/lambda-generator-handler/master/dependencies/npm)
![license](https://img.shields.io/npm/l/lambda-generator-handler.svg)

[![NPM](https://nodei.co/npm/lambda-generator-handler.png)](https://nodei.co/npm/lambda-generator-handler/)

## Install

```
$ npm install --save lambda-generator-handler
```

## Usage

Create your AWS Lambda function as a generator and then export it wrapped
by the `lambda-generator-handler` package.

```js
const generatorHandler = require('lambda-generator-handler');

function* someGenerator(event) {
    // 'event' arg is the AWS Lambda event object.
    // Throw an error if something bad happens.
    // Return a result as you normally do from a generator.
    return 'the result';
}

module.exports.handler = generatorHandler(someGenerator);
```

If your handler throws an exception, this wrapper catches it and 
passes it as the error back to AWS Lambda. It checks that the error 
message includes a `serverless` framework type of error code prefix
(e.g., the `[500]` prefix in the message `[500] Some error occurred`)
and adds one if none exists.

## License

MIT
