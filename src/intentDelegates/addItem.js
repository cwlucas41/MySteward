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
            handler.emit('Affirmative');
        })
        .catch(function(err) {
            console.log(err);
            handler.emit(':tell', handler.t('DATABASE_ERROR'));
        });
    }
};
