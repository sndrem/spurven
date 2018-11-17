"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.home = void 0;

var home = function home(bot) {
  bot.hear(/hello/i, function (res) {
    res.send("Hello World");
  });
  bot.hear(/vanne/i, function (res) {
    res.send("Vanne planter");
  });
};

exports.home = home;