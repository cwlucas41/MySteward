const expect = require('chai').expect;
const index = require('../index');
const languageStrings = require('../languageStrings')
const strings = languageStrings.strings.en.translation
const ssmlWrap = require('./resources/ssmlWrap')

const context = require('aws-lambda-mock-context');

describe("Testing AddItem intent", function() {
    describe("valid intput", function() {
        const ctx = context();
        var speechResponse = null
        var speechError = null

        before(function(done){
            index.handler(
            {
              "session": {
                "sessionId": "SessionId.26e6421a-0b46-45e4-baed-874c2ee039df",
                "application": {
                  "applicationId": "amzn1.ask.skill.8371afd6-d231-4b54-bf1d-5987733228cd"
                },
                "attributes": {},
                "user": {
                  "userId": "test"
                },
                "new": true
              },
              "request": {
                "type": "IntentRequest",
                "requestId": "EdwRequestId.4dc7928c-0874-4fb3-b178-c1037a34dee6",
                "locale": "en-US",
                "timestamp": "2017-03-11T22:42:33Z",
                "intent": {
                  "name": "AddItem",
                  "slots": {
                    "Item": {
                      "name": "Item",
                      "value": "eggs"
                    },
                    "Quantity": {
                      "name": "Quantity"
                    }
                  }
                }
              },
              "version": "1.0"
            }
            , ctx)
            ctx.Promise
                .then(resp => { speechResponse = resp; done(); })
                .catch(err => { speechError = err; done(); })
        })

        describe("The response is correct", function() {
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
        })
    })

    describe("invalid intput", function() {
        const ctx = context();
        var speechResponse = null
        var speechError = null

        before(function(done){
            index.handler(
            {
              "session": {
                "sessionId": "SessionId.26e6421a-0b46-45e4-baed-874c2ee039df",
                "application": {
                  "applicationId": "amzn1.ask.skill.8371afd6-d231-4b54-bf1d-5987733228cd"
                },
                "attributes": {},
                "user": {
                  "userId": "test"
                },
                "new": true
              },
              "request": {
                "type": "IntentRequest",
                "requestId": "EdwRequestId.4dc7928c-0874-4fb3-b178-c1037a34dee6",
                "locale": "en-US",
                "timestamp": "2017-03-11T22:42:33Z",
                "intent": {
                  "name": "AddItem",
                  "slots": {
                    "Item": {
                      "name": "Item",
                    },
                    "Quantity": {
                      "name": "Quantity"
                    }
                  }
                }
              },
              "version": "1.0"
            }
            , ctx)
            ctx.Promise
                .then(resp => { speechResponse = resp; done(); })
                .catch(err => { speechError = err; done(); })
        })

        describe("The response is correct", function() {
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
})
