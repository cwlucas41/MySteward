'use strict';

const removeItem = require('./removeItem');

module.exports = function(handler, table) {

    var record = {
        userId: handler.event.session.user.userId,
    }

    const slots = handler.event.request.intent.slots
    var baseQuantity = 1;
    var removedQuantity = 1;
    var skip = false;

    if (slots.Item && slots.Item.value)
        table
        .find({ hash: handler.event.session.user.userId
                range: slots.Item.value
                })
        .then(function(resp) {
            if (resp != undefined) {
              handler.emit(':tell', handler.t('QUANTITY_ZERO', slots.Item.value.toLowerCase()));
              skip = true
            } else {
              if (resp.quantity != undefined) {
                baseQuantity = resp.quantity;
              }
            }
        })


      if (slots.Quantity && slots.Quantity.value && (!skip)) {
        addedQuantity = slots.Quantity.value;
      }
      if (!skip) {
        var finalQuantity = baseQuantity - removedQuantity;
        if (finalQuantity < 0) {
          removeItem(handler, table);
        } else {
          table
          .update(slots.Item.value.toLowerCase(), { quanity: finalQuantity })
          .then(function(resp) {
              handler.emit('Affirmative');
          })
          .catch(function(err) {
              console.log(err);
              handler.emit('Error');
          });
        }
      }

    } else {
        console.log("error with itemName slot");
        handler.emit('Error')
    }
}
