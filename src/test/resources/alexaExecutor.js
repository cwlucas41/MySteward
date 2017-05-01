'use strict';

const index = require('../../index');
const context = require('aws-lambda-mock-context');
const dynasty = require('dynasty')({});
const wrapper = require('./databaseWrappers');

module.exports = {
    deleteItemThenExecute: function(table, item, input, callback) {
        const executor = this;
        wrapper.delete(table, item)
        .then(resp => executor.execute(input, callback))
        .catch(err => console.log(err))
    },

    insertItemThenExecute: function(table, item, input, callback) {
        const executor = this;
        wrapper.insert(table, item)
        .then(resp => executor.execute(input, callback))
        .catch(err => console.log(err))
    },

    execute: function(input, callback) {
        const ctx = context()
        index.handler(input, ctx)
        ctx.Promise
        .then(resp => { callback(null, resp) })
        .catch(err => { callback(err, null) })
    }
}
