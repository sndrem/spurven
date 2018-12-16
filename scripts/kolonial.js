// Commands:
//    hubot søk <produkt> - Returnerer produkter fra Kolonial.no basert på produktet du søker etter
//    hubot opppskrifter <produkt> - Returnerer oppskrift fra Kolonial.no basert på produktet du søker etter
//    hubot logg inn | login - Logger inn hos Kolonialen
//    hubot logg ut | logout - Logger ut hos Kolonialen
//    hubot handlekurv | hk - Viser handlekurven hos Kolonialen. Man må være logget inn for å vise denne
const { kolonial } = require('../dist/kolonial');

module.exports = kolonial;
