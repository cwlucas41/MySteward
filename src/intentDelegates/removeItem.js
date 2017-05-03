'use strict';

module.exports = function(handler, table) {

    var record = {
        hash: handler.event.session.user.userId,
    }

    const slots = handler.event.request.intent.slots

    if (slots.Item && slots.Item.value) {
        record.range = slots.Item.value.toLowerCase();

        table
        .remove(record)
        .then(function(resp) {
          if (slots.Item.value != slots.Item.original) {
              handler.emit(':tell', handler.t('REMOVE_MESSAGE_PLURAL', slots.Item.original));
          }
          else {
              handler.emit(':tell', handler.t('REMOVE_MESSAGE_SINGULAR', slots.Item.original));
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
