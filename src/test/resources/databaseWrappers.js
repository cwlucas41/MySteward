'use strict';

const index = require('../../index');
const dynasty = require('dynasty')({});
const pluralize = require('pluralize');

module.exports = {
    delete: function(table, item) {
        return new Promise(function(resolve, reject) {
            if (item.hash) {
                item.hash = pluralize.singular(item.hash);
            } else {
                console.log("database wrapper singularize problem")
            }
            table
            .remove(item)
            .then(resp => { resolve(resp) })
            .catch(err => { reject(err) })
        })
    },

    insert: function(table, item) {
        return new Promise(function(resolve, reject) {
            if (item.itemName) {
                item.itemName = pluralize.singular(item.itemName);
            } else {
                console.log("database wrapper singularize problem")
            }
            table
            .insert(item)
            .then(resp => { resolve(resp) })
            .catch(err => { reject(err) })
        })
    },

    find: function(table, item) {
        return new Promise(function(resolve, reject) {
            if (item.hash) {
                item.hash = pluralize.singular(item.hash);
            } else {
                console.log("database wrapper singularize problem")
            }
            table
            .find(item)
            .then(resp => { resolve(resp) })
            .catch(err => { reject(err) })
        })
    },
}
