import service from './services/arbeidstilsynetService';

function svarFraArbeidstilsynet(res, orgnr, err, data) {
  if (err) {
    res.send(err);
    return;
  }

  if (data.length === 0) {
    res.send(`Fant ingen organisasjoner hos arbeidstilsynet (renholdsregisteret) med orgnr: ${orgnr}`);
    return;
  }

  const org = data[0]["Organisation"];
  const recordStatus = data[0]["RecordStatus"];
  if (org) {
    res.send(`:bird: Jeg har nå sjekket ${org["Name"]} | Mob: ${org["Contact"]["MobileNumber"]} | Tlf: ${org["Contact"]["PhoneNumber"]} | Nett: ${org["Contact"]["WebAddress"]} `);

    const erGodkjent = recordStatus["Valid"];
    if (erGodkjent) {
      res.send(`:white_check_mark: ${org["Name"]} er ${recordStatus["Status"].toLowerCase()} :thumbsup:`);
      res.send(`${recordStatus["Description"]}`);
    } else {
      res.send(`:x: Status: ${recordStatus["Status"].toUpperCase()} - ${recordStatus["Description"]}`);
    }
    res.send(`Full info om bedriften finner du hos Arbeidstilsynets sider: https://arbeidstilsynet.no/renholdsvirksomhet/${orgnr}`);
  } else {
    res.send(":man-shrugging: Fant ingen organisasjon hos arbeidstilsynet for organisasjonsnummer: " + orgnr);
    res.send("Kan du ha skrevet feil? :thinking_face:");
    return;
  }
}

function svarFraSentralGodkjenning(res, orgnr, err, data) {
  if (err && err.statusCode === 404) {
    res.send(`:man-shrugging: Bedrift med orgnr ${orgnr} finnes ikke i det sentrale godkjenningsregisteret.`);
    return;
  } else if (err) {
    res.send(`Det skjedde en feil ved henting av bedriftsdata fra sentral godkjenningsregisteret for bedrift med orgnr: ${orgnr}.`);
    return;
  }

  const bedrift = data["dibk-sgdata"];
  const { approved: erGodkjent, approval_certificate } = bedrift.status;
  const { name = "Navn ikke tilgjengelig", www = "", email = "", phone = "" } = bedrift.enterprise;
  if (erGodkjent) {
    res.send(`:bird: Jeg har nå sjekket ${verdiEllerDefault(name, "Navn ikke tilgjengelig")} | Tlf: ${verdiEllerDefault(phone, "")} | Email: ${verdiEllerDefault(email, "")} | Nett: ${verdiEllerDefault(www, "")}`);
    res.send(`:white_check_mark: ${name} med orgnr: ${orgnr} er godkjent i det sentrale godkjenningsregisteret. Lenke til godkjenningsbevis: ${approval_certificate}. :thumbsup:`);
  }
}

function svarFraEnhetsregisteret(res, orgnr, err, data) {
  if (err) {
    res.send("Det var problemer med å hente data fra Enhetsregisteret");
    return;
  }
  const { registrertIMvaregisteret, navn, organisasjonsform: { beskrivelse } } = data._embedded.enheter[0];
  if (registrertIMvaregisteret) {
    res.send(`:white_check_mark: ${navn} (${beskrivelse}) er registrert i MVA-registeret :thumbsup:`);
  } else {
    res.send(`:x: ${navn} (${beskrivelse}) er ikke registrert i MVA-registeret :thumbsdown:`);
  }
}

function verdiEllerDefault(verdi, defaultVerdi) {
  return verdi ? verdi : defaultVerdi;
}

function sjekkerOrganisasjon(organisasjon) {
  return `Sjekker bedrift hos ${organisasjon} for deg...`;
}

export const arbeidstilsynet = (bot) => {
  bot.respond(/sjekk (\d+(?:\s+\d+)*)/i, (res) => {
    const orgnr = res.match[1].replace(/\s/g, "").trim();
    if (orgnr.length !== 9) {
      res.send("Organisasjonsnummer må være 9 siffer. Prøv igjen :recycle:");
      return;
    }
    if (orgnr) {
      res.send(sjekkerOrganisasjon("Enhetsregisteret"));
      service.sjekkEnhetsregisteret(orgnr, (err, data) => {
        svarFraEnhetsregisteret(res, orgnr, err, data);
        res.send("\n----------------------------------\n")
        res.send(sjekkerOrganisasjon("Arbeidstilsynet"));
        service.sjekkBedrift(orgnr, (err, data) => {
          svarFraArbeidstilsynet(res, orgnr, err, data);
          res.send("\n----------------------------------\n")
          res.send(sjekkerOrganisasjon("Sentral godkjenning"));
          service.sjekkSentralGodkjenning(orgnr, (sentralError, sentralData) => {
            svarFraSentralGodkjenning(res, orgnr, sentralError, sentralData);
          })
        });
      });

    }
  });
};