"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nyheter = void 0;

var _newsapi = _interopRequireDefault(require("newsapi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Description:
// 	Dette scriptet interagerer med newsapi for å gi oss de siste toppsakene i Norge
//
// Configuration:
// 	Du må sette en gyldig NEWS_API_KEY gitt av newsapi.org for å kommunisere med newsapi sitt api.
//
// Commands:
//    hubot nyheter - Returnerer toppsakene i Norge
require('dotenv').config();

var newsapi = new _newsapi.default(process.env.NEWS_API_KEY);

var nyheter = function nyheter(bot) {
  bot.respond(/nyheter/i, function (res) {
    newsapi.v2.topHeadlines({
      language: 'no',
      country: 'no'
    }).then(function (response) {
      console.log(response);
      var status = response.status,
          totalResults = response.totalResults,
          articles = response.articles;

      if (status === 'ok') {
        res.send("Hentet ".concat(totalResults, " av de siste toppsakene i Norge :newspaper:"));
        res.send(articles.map(function (article) {
          return "*".concat(article.title, "* - publisert ").concat(new Date(article.publishedAt).toString(), "\n").concat(article.content, "\nLes mer: ").concat(article.url);
        }).join('\n\n“'));
      } else {
        res.send('Kunne ikke hente nyheter :cry:');
      }
    });
  });
};

exports.nyheter = nyheter;