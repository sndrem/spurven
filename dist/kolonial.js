"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kolonial = void 0;

var _kolonialService = _interopRequireDefault(require("./services/kolonialService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var specifyProductError = function specifyProductError() {
  return 'Du må spesifisere hvilket produkt du ønsker oppskrift for. Feks. oppskrifter <pølse>';
};

var kolonial = function kolonial(bot) {
  bot.respond(/oppskrifter (.*)/i, function (res) {
    var product = res.match.length > 0 ? res.match[1] : null;

    if (!product) {
      res.send(specifyProductError());
      return;
    }

    res.send("Henter oppskrifter for ".concat(product, " for deg. Vennligst vent..."));

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
  bot.respond(/søk (.*)/i, function (res) {
    var product = res.match.length > 0 ? res.match[1] : null;

    if (!product) {
      res.send(specifyProductError());
      return;
    }

    res.send("S\xF8ker etter ".concat(product, " for deg"));

    _kolonialService.default.search(product, function (err, data) {
      if (err) {
        res.send("Jeg fant dessverre ingen treff for ".concat(product));
        return;
      }

      var availableItems = data.products.filter(function (item) {
        return item.availability.is_available;
      });
      res.send("Jeg fant ".concat(availableItems.length, " treff for ").concat(product));
      res.send(availableItems.map(function (item) {
        return "ID: ".concat(item.id, " - ").concat(item.full_name, ", ").concat(item.gross_price, " kr.\nLes mer: ").concat(item.front_url, "\nBilde: ").concat(item.images[0].thumbnail.url);
      }).join('\n\n'));
    });
  });
};

exports.kolonial = kolonial;