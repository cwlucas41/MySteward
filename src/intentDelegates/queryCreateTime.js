'use strict';

module.exports = function(handler, table) {

    const slots = handler.event.request.intent.slots

    if (slots.Item && slots.Item.value) {
        table
            .find({ hash: handler.event.session.user.userId,
                    range: slots.Item.value
                    })
            .then(function(resp) {
                if (resp != undefined && resp.createTime != undefined) {
                  handler.emit(':tell', handler.t('TIME_MESSAGE', slots.Item.value.toLowerCase(), resp.createTime));
                }
                else {
                  handler.emit(':tell', handler.t('NOTIME_MESSAGE', slots.Item.value.toLowerCase()));
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