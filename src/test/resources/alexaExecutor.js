'use strict';

const index = require('../../index');
const context = require('aws-lambda-mock-context');

module.exports = function executeSkill(input, callback) {
    const ctx = context()
    index.handler(input, ctx)
    ctx.Promise
    .then(resp => { callback(null, resp) })
    .catch(err => { callback(err, null) })
}
