'use strict';

module.exports = function(handler, table) {

    const slots = handler.event.request.intent.slots

    if (slots.Item && slots.Item.value) {
        table
            .find({ hash: handler.event.session.user.userId,
                    range: slots.Item.value
                    })
            .then(function(resp) { //TODO: handle undefined resp
                var amount = resp.quantity
                if (amount != 0) {
                  handler.emit(':tell', handler.t('QUANTITY_NONZERO', amount.toString(), slots.Item.value.toLowerCase()));
                }
                else {
                    handler.emit(':tell', handler.t('QUANTITY_ZERO', slots.Item.value.toLowerCase()));
                }
            })
            .catch(function(err) {
                console.log(err);
                handler.emit('ERROR');
            });

    } else {
        console.log("error with itemName slot");
        handler.emit('Error')
    }
}
