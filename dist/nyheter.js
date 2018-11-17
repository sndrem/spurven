"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nyheter = void 0;

var nyheter = function nyheter(bot) {
  bot.hear(/nyheter/i, function (res) {
    res.send('Her er dagens nyheter');
  });
  bot.hear(/hiyaa/i, function (res) {
    res.send('Halla');
  });
};

exports.nyheter = nyheter;