"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nyheter = void 0;

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.array.map");

var _newsapi = _interopRequireDefault(require("newsapi"));

var _cron = require("cron");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Description:
//  Dette scriptet interagerer med newsapi for å gi oss de siste toppsakene i Norge
//
// Configuration:
//  Du må sette en gyldig NEWS_API_KEY gitt av newsapi.org for å kommunisere med newsapi sitt api.
require('dotenv').config();

var newsapi = new _newsapi.default(process.env.NEWS_API_KEY);

var henteNyheterFeilmelding = function henteNyheterFeilmelding() {
  return 'Kunne ikke hente nyheter :cry:';
};

var nyheter = function nyheter(bot) {
  bot.respond(/nyheter/i, function (res) {
    hentNyheter();
  });
  var tz = 'Europe/Oslo';
  new _cron.CronJob('0 8 * * *', hentNyheter, null, true, tz); // Hver dag kl. 8.00

  var hentNyheter = function hentNyheter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      language: 'no',
      country: 'no'
    };
    var informasjon = _config.default.slackrooms.informasjon;
    newsapi.v2.topHeadlines(options).then(function (response) {
      var status = response.status,
          totalResults = response.totalResults,
          articles = response.articles;

      if (status === 'ok') {
        if (articles.length === 0) {
          bot.messageRoom(informasjon, 'Fant ingen nyheter');
          return;
        }

        bot.messageRoom(informasjon, "Hentet ".concat(totalResults, " av de siste toppsakene i Norge :newspaper:"));
        bot.messageRoom(informasjon, articles.map(function (article) {
          return "*".concat(article.title, "* - publisert ").concat(new Date(article.publishedAt).toString(), "\n").concat(article.content !== null ? article.content : '', "\nLes mer: ").concat(article.url);
        }).join('\n\n'));
      } else {
        bot.messageRoom(informasjon, henteNyheterFeilmelding());
      }
    }).catch(function () {
      bot.messageRoom(informasjon, henteNyheterFeilmelding());
    });
  };
};

exports.nyheter = nyheter;