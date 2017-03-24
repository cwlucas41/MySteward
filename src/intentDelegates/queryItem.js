'use strict';

module.exports = function(handler, table) {

    var record = {
        userId: handler.event.session.user.userId,
    }

    const slots = handler.event.request.intent.slots

    if (slots.Item && slots.Item.value) {
        record.itemName = slots.Item.value.toLowerCase();

        var answer = table.find(record);

        answer
            .then(function(amount) {
                handler.emit(answer.toString());
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
