'use strict';

const index = require('../../index');
const context = require('aws-lambda-mock-context');
const dynasty = require('dynasty')({});

module.exports = {
    deleteItemThenExecute: function(table, item, input, callback) {
        table
        // {hash: testUserId, range: testItemName}
        .remove(item)
        .then((resp) => {
            this.execute(input, callback)
        }).catch(err => { callback(err,null) })
    },

    insertItemThenExecute: function(table, item, input, callback) {
        table
        //{userId: testUserId, itemName: testItemName}
        .insert(item)
        .then((resp) => {
            this.execute(input, callback)
        }).catch(err => { callback(err,null) })
    },

    execute: function(input, callback) {
        const ctx = context()
        index.handler(input, ctx)
        ctx.Promise
        .then(resp => { callback(null, resp) })
        .catch(err => { callback(err, null) })
    }
}
