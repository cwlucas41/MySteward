'use strict';

module.exports = function(handler, table) {

    const slots = handler.event.request.intent.slots

    if (slots.Item && slots.Item.value) {
        table
            .find({ hash: handler.event.session.user.userId,
                    range: slots.Item.value
                    })
            .then(function(resp) {
                if (resp != undefined && resp.location != undefined) {
                  handler.emit(':tell', handler.t('LOCATION_MESSAGE', resp.location));
                }
                else {
                  handler.emit(':tell', handler.t('NO_LOCATION_MESSAGE'));
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
