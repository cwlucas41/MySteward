'use strict';

module.exports = function(handler, table) {

    var record = {
        userId: handler.event.session.user.userId,
    }

    const slots = handler.event.request.intent.slots

    if (slots.Item && slots.Item.value) {
        table
            .find({itemName: record})
            .then(function(amount) {
                if (amount != 0) {
                    handler.emit(':tell', this.t('QUANTITY_ZERO', amount.toString()));
                }
                else {
                    handler.emit(':tell', this.t('QUANTITY_NONZERO', amount.toString(), slots.Item.value.toLowerCase()));
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
