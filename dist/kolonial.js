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

var getProduct = function getProduct(res) {
  return res.match.length > 0 ? res.match[1] : null;
};

var transformRecipeToString = function transformRecipeToString(recipe) {
  return "ID: ".concat(recipe.id, " - ").concat(recipe.title, ", ").concat(recipe.cooking_duration_string, " - ").concat(recipe.difficulty_string, "\nLes mer: ").concat(recipe.front_url);
};

var transformProductToString = function transformProductToString(product) {
  return "ID: ".concat(product.id, " - ").concat(product.full_name, ", ").concat(product.gross_price, " kr.\nLes mer: ").concat(product.front_url, "\nBilde: ").concat(product.images[0].thumbnail.url);
};

var kolonial = function kolonial(bot) {
  bot.respond(/oppskrifter (.*)/i, function (res) {
    var product = getProduct(res);

    if (!product) {
      res.send(specifyProductError());
      return null;
    }

    res.send("Henter oppskrifter for ".concat(product, " for deg. Vennligst vent..."));

    _kolonialService.default.getRecipes(product, function (err, data) {
      if (err) {
        res.send("Fant dessverre ingen oppskrifter for ".concat(product, ". Pr\xF8v igjen med noen andre produkter."));
        return;
      }

      res.send("Jeg fant ".concat(data.results.length, " oppskrifter for ").concat(product));
      res.send(data.results.map(transformRecipeToString).join('\n\n'));
    });
  });
  bot.respond(/søk (.*)/i, function (res) {
    var product = getProduct(res);

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
      res.send(availableItems.map(transformProductToString).join('\n\n'));
    });
  });
  bot.respond(/(handlekurv|hk)/i, function (res) {
    res.send('Henter handlekurven for deg');

    _kolonialService.default.getCart(function (err, data) {
      if (err) {
        if (err.statusCode === 401) {
          res.send(err.message);
          return;
        }

        res.send('Kunne ikke hente handlekurven for deg.');
        return;
      }

      if (data.items.length === 0) {
        res.send(data.label_text);
        return;
      }

      res.send("Handlekurven inneholder ".concat(data.items.length, " produkter til en verdi av kr ").concat(data.total_gross_amount, " NOK.\n\n").concat(data.extra_lines.map(function (line) {
        return "".concat(line.description, ": ").concat(line.gross_amount, " NOK");
      }).join('\n')));
      res.send('\n\nHer er varene du har i handlekurven nå');
      res.send(data.items.map(function (item) {
        return transformProductToString(item.product);
      }).join('\n\n'));
    });
  });
  bot.respond(/(login|logg inn)/i, function (res) {
    res.send('Logger inn med Sindres bruker...');

    _kolonialService.default.login(function (err, data) {
      if (err) {
        res.send('Det var dessverre problemer med å logge inn. Sjekk med Sindre at brukernavn og passord er korrekt');
        return;
      }

      res.send('Du er nå logget inn med Sindres bruker');
    });
  });
  bot.respond(/(logout|logg ut)/i, function (res) {
    res.send('Logger ut av Sindres bruker...');

    _kolonialService.default.logout(function (err, data) {
      if (err) {
        res.send('Klarte ikke logge ut akkurat nå. Prøv igjen senere');
        return;
      }

      res.send('Du er nå logget ut av Sindres bruker');
    });
  });
};

exports.kolonial = kolonial;