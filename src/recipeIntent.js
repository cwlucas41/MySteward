'use strict';

module.exports = {
  delegate: function (handler, table) {

      const itemSlot = handler.event.request.intent.slots.Item;
      let itemName;
      if (itemSlot && itemSlot.value) {
          itemName = itemSlot.value.toLowerCase();
      }

      const cardTitle = handler.t('DISPLAY_CARD_TITLE', handler.t('SKILL_NAME'), itemName);
      const myRecipes = handler.t('RECIPES');
      const recipe = myRecipes[itemName];

      if (recipe) {
          handler.attributes.speechOutput = recipe;
          handler.attributes.repromptSpeech = handler.t('RECIPE_REPEAT_MESSAGE');
          handler.emit(':askWithCard', recipe, handler.attributes.repromptSpeech, cardTitle, recipe);
      } else {
          let speechOutput = handler.t('RECIPE_NOT_FOUND_MESSAGE');
          const repromptSpeech = handler.t('RECIPE_NOT_FOUND_REPROMPT');
          if (itemName) {
              speechOutput += handler.t('RECIPE_NOT_FOUND_WITH_ITEM_NAME', itemName);
          } else {
              speechOutput += handler.t('RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME');
          }
          speechOutput += repromptSpeech;

          handler.attributes.speechOutput = speechOutput;
          handler.attributes.repromptSpeech = repromptSpeech;

          handler.emit(':ask', speechOutput, repromptSpeech);
      }
  }
};
