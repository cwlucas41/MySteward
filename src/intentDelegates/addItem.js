'use strict';

module.exports = {
    delegate: function(handler, table) {

        var record = {
            userId: handler.event.session.user.userId,
        }

        const slots = handler.event.request.intent.slots

        if (slots.Item && slots.Item.value) {
            record.itemName = slots.Item.value.toLowerCase();
        } else {
            console.log("error with itemName slot");
        }

        table
        .insert(record)
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
