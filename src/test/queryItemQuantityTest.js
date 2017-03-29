'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;
const languageStrings = require('../languageStrings')
const ssmlWrap = require('./resources/ssmlWrap')
const executor = require('./resources/alexaExecutor')
const dynasty = require('dynasty')({});
const sprintf = require("sprintf-js").sprintf

const strings = languageStrings.strings.en.translation
const stewardItems = dynasty.table('Steward_Items');

const testUserId = 'test'
const testItemName = 'eggs'
const testQuantity = 5

const blankInput =
{
    "session": {
        "sessionId": "SessionId.26e6421a-0b46-45e4-baed-874c2ee039df",
        "application": {"applicationId": "amzn1.ask.skill.8371afd6-d231-4b54-bf1d-5987733228cd"},
        "attributes": {},
        "user": {"userId": testUserId},
        "new": true
    },
    "request": {
        "type": "IntentRequest",
        "locale": "en-US",
        "intent": {
            "name": "QueryItem",
            "slots": {
                "Item": {"name": "Item"}
            }
        }
    },
    "version": "1.0"
}

function insertTestItemThenExecute(input, amount, callback) {
    stewardItems
    .insert({userId: testUserId, itemName: testItemName, quantity: amount})
    .then((resp) => {
        executor(input, callback)
    }).catch(err => { callback(err,null) })
}

function deleteTestItemThenExecute(input, callback) {
    stewardItems
    .remove({hash: testUserId, range: testItemName})
    .then((resp) => {
        executor(input, callback)
    }).catch(err => { callback(err,null) })
}

describe("Testing QueryItem intent", function() {

    describe("valid input with quantity of 1", function() {
        var speechResponse = null
        var speechError = null
        var currentQuantity = 1

        before(function(done){
            var input = JSON.parse(JSON.stringify(blankInput))
            input.request.intent.slots.Item.value = testItemName
            insertTestItemThenExecute(input, currentQuantity, function(err, resp) {
                if (err) { console.log(err); speechError = err}
                else { speechResponse = resp }
                done()
            })
        })

        it('should not have errored',function() {
            expect(speechError).to.be.null
        })

        it("should have an answer with quantity", function() {
            var expected = sprintf(strings.QUANTITY_NONZERO, currentQuantity, testItemName.toString())
            expect(speechResponse.response.outputSpeech.ssml).to.be.string(ssmlWrap(expected))
        })

        it("should end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })

    describe("valid input with quantity of 0", function() {
        var speechResponse = null
        var speechError = null
        var currentQuantity = 0

        before(function(done){
            var input = JSON.parse(JSON.stringify(blankInput))
            input.request.intent.slots.Item.value = testItemName
            insertTestItemThenExecute(input, currentQuantity, function(err, resp) {
                if (err) { console.log(err); speechError = err}
                else { speechResponse = resp }
                done()
            })
        })

        it('should not have errored',function() {
            expect(speechError).to.be.null
        })

        it("should have an answer with quantity", function() {
            var expected = sprintf(strings.QUANTITY_ZERO, testItemName)
            expect(speechResponse.response.outputSpeech.ssml).to.be.string(ssmlWrap(expected))
        })

        it("should end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })

    describe("valid input with quantity of random", function() {
        var speechResponse = null
        var speechError = null
        var currentQuantity = Math.floor((Math.random() * (100 - 2)) + 2);

        before(function(done){
            var input = JSON.parse(JSON.stringify(blankInput))
            input.request.intent.slots.Item.value = testItemName
            insertTestItemThenExecute(input, currentQuantity, function(err, resp) {
                if (err) { console.log(err); speechError = err}
                else { speechResponse = resp }
                done()
            })
        })

        it('should not have errored',function() {
            expect(speechError).to.be.null
        })

        it("should have an answer with quantity", function() {
            var expected = sprintf(strings.QUANTITY_NONZERO, currentQuantity, testItemName.toString())
            expect(speechResponse.response.outputSpeech.ssml).to.be.string(ssmlWrap(expected))
        })

        it("should end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })

    describe("valid input with no item in table", function() {
        var speechResponse = null
        var speechError = null
        var currentQuantity = 0;

        before(function(done){
            var input = JSON.parse(JSON.stringify(blankInput))
            input.request.intent.slots.Item.value = testItemName
            deleteTestItemThenExecute(input, function(err, resp) {
                if (err) { console.log(err); speechError = err}
                else { speechResponse = resp }
                done()
            })
        })

        it('should not have errored',function() {
            expect(speechError).to.be.null
        })

        it("should have a regular message with quantity 0", function() {
          var expected = sprintf(strings.QUANTITY_ZERO, testItemName)
          expect(speechResponse.response.outputSpeech.ssml).to.be.string(ssmlWrap(expected))
        })

        it("should end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })

    describe("invalid input - no item", function() {
        var speechResponse = null
        var speechError = null
        var currentQuantity = 0;

        before(function(done){
            var input = JSON.parse(JSON.stringify(blankInput))
            insertTestItemThenExecute(input, currentQuantity, function(err, resp) {
                if (err) { console.log(err); speechError = err}
                else { speechResponse = resp }
                done()
            })
        })

        it('should not have errored',function() {
            expect(speechError).to.be.null
        })

        it("should have an error message", function() {
            expect(speechResponse.response.outputSpeech.ssml).to.be.string(ssmlWrap(strings.ERROR_MESSAGE))
        })

        it("should end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })
})
