"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kolonial = void 0;

var _kolonialService = _interopRequireDefault(require("./services/kolonialService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var kolonial = function kolonial(bot) {
  bot.respond(/oppskrifter (.*)/i, function (res) {
    var product = res.match.length > 0 ? res.match[1] : null;

    if (!product) {
      res.send('Du må spesifisere hvilket produkt du ønsker oppskrift for. Feks. oppskrifter <pølse>');
      return;
    }

    res.send('Henter oppskrifter for deg. Vennligst vent...');

    _kolonialService.default.getRecipes(product, function (err, data) {
      if (err) {
        res.send("Fant dessverre ingen oppskrifter for ".concat(product, ". Pr\xF8v igjen med noen andre produkter."));
        return;
      }

      res.send("Jeg fant ".concat(data.results.length, " oppskrifter for ").concat(product));
      res.send(data.results.map(function (recipe) {
        return "".concat(recipe.title, ", ").concat(recipe.cooking_duration_string, " - ").concat(recipe.difficulty_string, "\nLes mer: ").concat(recipe.front_url);
      }).join('\n\n'));
    });
  });
};

exports.kolonial = kolonial;