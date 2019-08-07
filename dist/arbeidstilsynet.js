"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arbeidstilsynet = void 0;

require("core-js/modules/es6.string.trim");

require("core-js/modules/es6.regexp.match");

var _arbeidstilsynetService = _interopRequireDefault(require("./services/arbeidstilsynetService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var arbeidstilsynet = function arbeidstilsynet(bot) {
  bot.respond(/sjekk (\d*)/i, function (res) {
    var orgnr = res.match[1];

    if (orgnr.trim().length !== 9) {
      res.send("Organisasjonsnummer må være 9 siffer. Prøv igjen :recycle:");
      return;
    }

    if (orgnr) {
      res.send("Sjekker bedrift for deg...");

      _arbeidstilsynetService.default.sjekkBedrift(orgnr, function (err, data) {
        if (err) {
          res.send(err);
          return;
        }

        if (data.length === 0) {
          res.send("Fant ingen organisasjoner med orgnr: ".concat(orgnr));
          return;
        }

        var org = data[0]["Organisation"];
        var recordStatus = data[0]["RecordStatus"];

        if (org) {
          res.send(":bird: Jeg har n\xE5 sjekket ".concat(org["Name"], " | Mob: ").concat(org["Contact"]["MobileNumber"], " | Tlf: ").concat(org["Contact"]["PhoneNumber"], " | Nett: ").concat(org["Contact"]["WebAddress"], " "));
          var erGodkjent = recordStatus["Valid"];

          if (erGodkjent) {
            res.send(":thumbsup: ".concat(org["Name"], " er ").concat(recordStatus["Status"].toLowerCase()));
            res.send("".concat(recordStatus["Description"]));
          } else {
            res.send(":skull_and_crossbones: Status: ".concat(recordStatus["Status"].toUpperCase(), " - ").concat(recordStatus["Description"]));
          }

          res.send("Full info om bedriften finner du hos Arbeidstilsynets sider: https://arbeidstilsynet.no/renholdsvirksomhet/".concat(orgnr));
        } else {
          res.send("Fant ingen organisasjon hos arbeidstilsynet for organisasjonsnummer: " + orgnr);
          res.send("Kan du ha skrevet feil? :thinking_face:");
          return;
        }
      });
    }
  });
};

exports.arbeidstilsynet = arbeidstilsynet;