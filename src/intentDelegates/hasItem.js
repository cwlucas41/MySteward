'use strict';

module.exports = function(handler, table) {

    var record = {
        hash: handler.event.session.user.userId,
    }

    const slots = handler.event.request.intent.slots

    if (slots.Item && slots.Item.value) {
        record.range = slots.Item.value.toLowerCase();

        table
        .find(record)
        .then(function(resp) {
            if (resp != undefined){
				handler.emit(":tell",handler.t('HASITEM_MESSAGE',record.range));
			} else{
				handler.emit(':tell',handler.t('NOITEM_MESSAGE',record.range));
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
