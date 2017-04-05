'use strict';

const createItem = require('./../helperDelegates/createItem');

module.exports = function(handler, table) {

    var record = {
        userId: handler.event.session.user.userId,
    }

    const slots = handler.event.request.intent.slots
    var setQuantity = 1;

    if (slots.Item && slots.Item.value)
        table
        .find({ hash: handler.event.session.user.userId
                range: slot.Item.value
                })
        .then(function(resp) {
            if (resp != undefined) {
              createItem(handler, table);
            } else {
              baseQuantity = resp.quantity;
            }
        })

      if (slots.Quantity && slots.Quantity.value) {
        setQuantity = slots.Quantity.value;
      }
      table
      .update(slots.Item.value.toLowerCase(), { quanity: setQuantity })
      .then(function(resp) {
          handler.emit('Affirmative');
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
