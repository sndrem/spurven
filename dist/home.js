"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.home = void 0;

// Commands:
//    vanne planter - Forteller deg hvordan du vanner plantene i leiligheten
//    egg - Forteller deg hvordan du koker egg
var home = function home(bot) {
  bot.respond(/(vann(e)?|plant(er)?)/i, function (res) {
    res.send("Lurer du p\xE5 hvordan du skal vanne plantene? :leaves:\n    * *Husfred* (liten, sm\xE5 blader) skal ha masse vann. Vannes fra undersiden. Settes i sk\xE5l/vasken med vann i ca. 5 minutter.\n    * *Kaktus* skal ha lite vann. Gis litt vann n\xE5r den er er helt t\xF8rr.\n    * *Ef\xF8y* ved iMac skal ha vann en gang i uken ca. Bladene skal sprayes med vann ca. hver 3 uke. \n    * *Stor* plante i stativ ved tv skal ha vann ca. en gang i uken, eller n\xE5r den er helt t\xF8rket ut Kan fint sprayes med vann p\xE5 bladene av og til.\n    * *Plante* under tak skal ha vann en gang i uken ca. Kan med fordel settes i vinduskarm og f\xE5 litt lys av og til.\n    * *Plante* ved kj\xF8kkenvindu skal ha vann ca. en gang i uken, eller n\xE5r den er t\xF8rr.\n    \n    Takk for at du vanner plantene :sunflower:");
  });
  bot.respond(/^egg$/i, function (res) {
    res.send("Slik koker du egg :egg: :smiley_cat:\n    *Hardkokt*: Legg x antall egg i kaldt vann i kjelen, og sett p\xE5 komfyren p\xE5 h\xF8yeste varme.\n    N\xE5r det koker trekker du kjelen av platen, tar p\xE5 lokket og venter 11 minutter. Etter 11 minuttene lar du eggene kj\xF8le seg i rennende kaldt vann.");
  });
};

exports.home = home;