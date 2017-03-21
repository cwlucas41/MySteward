const expect = require('chai').expect;
const index = require('../index');
const languageStrings = require('../languageStrings')
const ssmlWrap = require('./resources/ssmlWrap')
const dynasty = require('dynasty')({});
const context = require('aws-lambda-mock-context');

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

function deleteTestItemThen(then, input, ctx, callback) {
    stewardItems
    .remove({hash: testUserId, range: testItemName})
    .then((resp) => {
        then(input, ctx, callback)
    }).catch(err => { callback(err,null) })
}

function executeSkill(input, ctx, callback) {
    index.handler(input, ctx)
    ctx.Promise
    .then(resp => { callback(null, resp) })
    .catch(err => { callback(err, null) })
}

describe("Testing AddItem intent", function() {

    describe("valid intput without quantity", function() {
        const ctx = context();
        var speechResponse = null
        var speechError = null

        before(function(done){
            var input = JSON.parse(JSON.stringify(blankInput))
            input.request.intent.slots.Item.value = testItemName
            deleteTestItemThen(executeSkill, input, ctx, function(err, resp) {
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

        it("should have inserted to the database with quantity of one", function() {
            return stewardItems.find({hash: "test", range: "eggs"})
            .then(function(resp) {
                expect(resp.quantity).to.be.equal(1)
            }).catch(function(err) {
                assert.fail()
            })
        })
    })

    describe("valid intput with quantity", function() {
        const ctx = context();
        var speechResponse = null
        var speechError = null

        before(function(done){
            var input = JSON.parse(JSON.stringify(blankInput))
            input.request.intent.slots.Item.value = testItemName
            input.request.intent.slots.Quantity.value = 5
            deleteTestItemThen(executeSkill, input, ctx, function(err, resp) {
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

        it("should have inserted to the database with quantity of input", function() {
            return stewardItems.find({hash: "test", range: "eggs"})
            .then(function(resp) {
                expect(resp.quantity).to.be.equal(5)
            }).catch(function(err) {
                assert.fail()
            })
        })
    })

    describe("invalid intput", function() {
        const ctx = context();
        var speechResponse = null
        var speechError = null

        before(function(done){
            var input = JSON.parse(JSON.stringify(blankInput))
            deleteTestItemThen(executeSkill, input, ctx, function(err, resp) {
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
