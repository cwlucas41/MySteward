'use strict';

const pluralize = require('pluralize');

module.exports = function(handler, table) {

    const slots = handler.event.request.intent.slots

    if (slots.Item && slots.Item.value) {
        table
            .find({ hash: handler.event.session.user.userId,
                    range: slots.Item.value
                    })
            .then(function(resp) {
                const pluralName = pluralize(slots.Item.value)
                if (resp != undefined && resp.quantity != undefined && resp.quantity != 0) {
                  handler.emit(':tell', handler.t('QUANTITY_NONZERO', resp.quantity, pluralName));
                }
                else {
                  handler.emit(':tell', handler.t('QUANTITY_ZERO', pluralName));
                }
            })
            .catch(function(err) {
                console.log(err);
                handler.emit('Error');
            });

    } else {
        console.log("error with itemName slot");
        handler.emit('Error')
    }
}
