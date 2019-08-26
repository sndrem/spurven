"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arbeidstilsynet = void 0;

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.string.trim");

require("core-js/modules/es6.function.name");

var _arbeidstilsynetService = _interopRequireDefault(require("./services/arbeidstilsynetService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
      res.send(":white_check_mark: ".concat(org["Name"], " er ").concat(recordStatus["Status"].toLowerCase(), " :thumbsup:"));
      res.send("".concat(recordStatus["Description"]));
    } else {
      res.send(":x: Status: ".concat(recordStatus["Status"].toUpperCase(), " - ").concat(recordStatus["Description"]));
    }

    res.send("Full info om bedriften finner du hos Arbeidstilsynets sider: https://arbeidstilsynet.no/renholdsvirksomhet/".concat(orgnr));
  } else {
    res.send(":man-shrugging: Fant ingen organisasjon hos arbeidstilsynet for organisasjonsnummer: " + orgnr);
    res.send("Kan du ha skrevet feil? :thinking_face:");
    return;
  }
}

function svarFraSentralGodkjenning(res, orgnr, err, data) {
  if (err && err.statusCode === 404) {
    res.send(":man-shrugging: Bedrift med orgnr ".concat(orgnr, " finnes ikke i det sentrale godkjenningsregisteret."));
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
    res.send(":white_check_mark: ".concat(name, " med orgnr: ").concat(orgnr, " er godkjent i det sentrale godkjenningsregisteret. Lenke til godkjenningsbevis: ").concat(approval_certificate, ". :thumbsup:"));
  }
}

function svarFraEnhetsregisteret(res, orgnr, err, data) {
  if (err) {
    res.send("Det var problemer med å hente data fra Enhetsregisteret");
    return;
  }

  var _data$_embedded$enhet = data._embedded.enheter[0],
      registrertIMvaregisteret = _data$_embedded$enhet.registrertIMvaregisteret,
      navn = _data$_embedded$enhet.navn,
      beskrivelse = _data$_embedded$enhet.organisasjonsform.beskrivelse;

  if (registrertIMvaregisteret) {
    res.send(":white_check_mark: ".concat(navn, " (").concat(beskrivelse, ") er registrert i MVA-registeret :thumbsup:"));
  } else {
    res.send(":x: ".concat(navn, " (").concat(beskrivelse, ") er ikke registrert i MVA-registeret :thumbsdown:"));
  }
}

function verdiEllerDefault(verdi, defaultVerdi) {
  return verdi ? verdi : defaultVerdi;
}

function sjekkerOrganisasjon(organisasjon) {
  return "Sjekker bedrift hos ".concat(organisasjon, " for deg...");
}

var arbeidstilsynet = function arbeidstilsynet(bot) {
  bot.respond(/sjekk (\d+(?:\s+\d+)*)/i, function (res) {
    var orgnr = res.match[1].replace(/\s/g, "").trim();

    if (orgnr.length !== 9) {
      res.send("Organisasjonsnummer må være 9 siffer. Prøv igjen :recycle:");
      return;
    }

    if (orgnr) {
      res.send(sjekkerOrganisasjon("Enhetsregisteret"));

      _arbeidstilsynetService["default"].sjekkEnhetsregisteret(orgnr, function (err, data) {
        svarFraEnhetsregisteret(res, orgnr, err, data);
        res.send("\n----------------------------------\n");
        res.send(sjekkerOrganisasjon("Arbeidstilsynet"));

        _arbeidstilsynetService["default"].sjekkBedrift(orgnr, function (err, data) {
          svarFraArbeidstilsynet(res, orgnr, err, data);
          res.send("\n----------------------------------\n");
          res.send(sjekkerOrganisasjon("Sentral godkjenning"));

          _arbeidstilsynetService["default"].sjekkSentralGodkjenning(orgnr, function (sentralError, sentralData) {
            svarFraSentralGodkjenning(res, orgnr, sentralError, sentralData);
          });
        });
      });
    }
  });
};

exports.arbeidstilsynet = arbeidstilsynet;