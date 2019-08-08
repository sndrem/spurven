"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arbeidstilsynet = void 0;

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.string.trim");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.function.name");

var _arbeidstilsynetService = _interopRequireDefault(require("./services/arbeidstilsynetService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function svarFraArbeidstilsynet(res, orgnr, err, data) {
  if (err) {
    res.send(err);
    return;
  }

  if (data.length === 0) {
    res.send("Fant ingen organisasjoner hos arbeidstilsynet (renholdsregisteret) med orgnr: ".concat(orgnr));
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
}

function svarFraSentralGodkjenning(res, orgnr, err, data) {
  if (err && err.statusCode === 404) {
    res.send("Bedrift med orgnr ".concat(orgnr, " finnes ikke i det sentrale godkjenningsregisteret"));
    return;
  } else if (err) {
    res.send("Det skjedde en feil ved henting av bedriftsdata fra sentral godkjenningsregisteret for bedrift med orgnr: ".concat(orgnr, "."));
    return;
  }

  var bedrift = data["dibk-sgdata"];
  var _bedrift$status = bedrift.status,
      erGodkjent = _bedrift$status.approved,
      approval_certificate = _bedrift$status.approval_certificate;
  var _bedrift$enterprise = bedrift.enterprise,
      _bedrift$enterprise$n = _bedrift$enterprise.name,
      name = _bedrift$enterprise$n === void 0 ? "Navn ikke tilgjengelig" : _bedrift$enterprise$n,
      _bedrift$enterprise$w = _bedrift$enterprise.www,
      www = _bedrift$enterprise$w === void 0 ? "" : _bedrift$enterprise$w,
      _bedrift$enterprise$e = _bedrift$enterprise.email,
      email = _bedrift$enterprise$e === void 0 ? "" : _bedrift$enterprise$e,
      _bedrift$enterprise$p = _bedrift$enterprise.phone,
      phone = _bedrift$enterprise$p === void 0 ? "" : _bedrift$enterprise$p;

  if (erGodkjent) {
    res.send(":bird: Jeg har n\xE5 sjekket ".concat(verdiEllerDefault(name, "Navn ikke tilgjengelig"), " | Tlf: ").concat(verdiEllerDefault(phone, ""), " | Email: ").concat(verdiEllerDefault(email, ""), " | Nett: ").concat(verdiEllerDefault(www, "")));
    res.send(":thumbsup: ".concat(name, " med orgnr: ").concat(orgnr, " er godkjent i det sentrale godkjenningsregisteret. Lenke til godkjenningsbevis: ").concat(approval_certificate, "."));
  }
}

function verdiEllerDefault(verdi, defaultVerdi) {
  if (verdi) return verdi;
  return defaultVerdi;
}

var arbeidstilsynet = function arbeidstilsynet(bot) {
  bot.respond(/sjekk (\d*)/i, function (res) {
    console.log(res.match);
    var orgnr = res.match[1].replace(/\s/g, "").trim();
    console.log("Orgnr", orgnr);

    if (orgnr.length !== 9) {
      res.send("Organisasjonsnummer må være 9 siffer. Prøv igjen :recycle:");
      return;
    }

    if (orgnr) {
      res.send("Sjekker bedrift hos arbeidstilsynet for deg...");

      _arbeidstilsynetService.default.sjekkBedrift(orgnr, function (err, data) {
        svarFraArbeidstilsynet(res, orgnr, err, data);
        res.send("\n----------------------------------\n");
        res.send("Sjekker bedrift hos sentral godkjenning...");

        _arbeidstilsynetService.default.sjekkSentralGodkjenning(orgnr, function (sentralError, sentralData) {
          svarFraSentralGodkjenning(res, orgnr, sentralError, sentralData);
        });
      });
    }
  });
};

exports.arbeidstilsynet = arbeidstilsynet;