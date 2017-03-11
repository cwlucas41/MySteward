'use strict';

module.exports = {
    delegate: function (handler, table) {

        table
        .insert({ userId: "cwlucas41", itemName: "software" })
        .then(function(resp) {
            handler.attributes.speechOutput = handler.t('WELCOME_MESSAGE', handler.t('SKILL_NAME'));
            handler.attributes.repromptSpeech = handler.t('WELCOME_REPROMT');
            handler.emit(':ask', handler.attributes.speechOutput, handler.attributes.repromptSpeech);
        })
        .catch(function(err) {
            console.log(err);
        });
    }
};
