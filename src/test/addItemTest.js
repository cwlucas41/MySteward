'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;
const languageStrings = require('../languageStrings')
const ssmlWrap = require('./resources/ssmlWrap')
const executor = require('./resources/alexaExecutor')
const dynasty = require('dynasty')({});

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
            "name": "AddItem",
            "slots": {
                "Item": {"name": "Item"},
                "Quantity": {"name": "Quantity"}
            }
        }
    },
    "version": "1.0"
}

describe("Testing AddItem intent", function() {

    describe("valid intput without quantity", function() {
        var speechResponse = null
        var speechError = null
        var insertedItem = null

        before(function(done){
            var input = JSON.parse(JSON.stringify(blankInput))
            input.request.intent.slots.Item.value = testItemName
            const testItem = {hash: testUserId, range: testItemName};
            executor.deleteItemThenExecute(stewardItems, testItem, input, function(err, resp) {
                if (err) { console.log(err); speechError = err}
                else { speechResponse = resp }
                done()
            })
        })

        it('should not have errored',function() {
            expect(speechError).to.be.null
        })

        it("should have an affirmative message", function() {
            expect(speechResponse.response.outputSpeech.ssml).to.be.oneOf(strings.AFFIRMATIVE_MESSAGE.map(ssmlWrap))
        })

        it("should end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })

        it("should have inserted an item", function() {
            return stewardItems.find({hash: testUserId, range: testItemName})
            .then(function(resp) {
                insertedItem = resp
            }).catch(function(err) {
                assert.fail()
            })
        })

        it("inserted item should have quantity of 1", function() {
            expect(insertedItem.quantity).to.be.equal(1)
        })

        it("inserted item shoudl have creation timestamp", function() {
            expect(insertedItem.createTime).not.to.be.null
        })

    })

    describe("valid input with quantity", function() {
        var speechResponse = null
        var speechError = null
        var insertedItem = null

        before(function(done){
            var input = JSON.parse(JSON.stringify(blankInput))
            input.request.intent.slots.Item.value = testItemName
            input.request.intent.slots.Quantity.value = testQuantity
            const testItem = {hash: testUserId, range: testItemName};
            executor.deleteItemThenExecute(stewardItems, testItem, input, function(err, resp) {
                if (err) { console.log(err); speechError = err}
                else { speechResponse = resp }
                done()
            })
        })

        it('should not have errored',function() {
            expect(speechError).to.be.null
        })

        it("should have an affirmative message", function() {
            expect(speechResponse.response.outputSpeech.ssml).to.be.oneOf(strings.AFFIRMATIVE_MESSAGE.map(ssmlWrap))
        })

        it("should end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })

        it("should have inserted an item", function() {
            return stewardItems.find({hash: testUserId, range: testItemName})
            .then(function(resp) {
                insertedItem = resp
            }).catch(function(err) {
                assert.fail()
            })
        })

        it("inserted item should have quantity of testQuantity", function() {
            expect(insertedItem.quantity).to.be.equal(testQuantity)
        })

        it("inserted item shoudl have creation timestamp", function() {
            expect(insertedItem.createTime).not.to.be.null
        })
    })

    describe("invalid input", function() {
        var speechResponse = null
        var speechError = null

        before(function(done){
            var input = JSON.parse(JSON.stringify(blankInput))
            const testItem = {hash: testUserId, range: testItemName};
            executor.deleteItemThenExecute(stewardItems, testItem, input, function(err, resp) {
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

        it("should not have inserted to the database", function() {
            return stewardItems.find({hash: "test", range: "eggs"})
            .then(function(resp) {
                expect(resp).to.be.undefined
            }).catch(function(err) {
                assert.fail()
            })
        })
    })
})
