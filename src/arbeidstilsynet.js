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
      res.send(`:thumbsup: ${org["Name"]} er ${recordStatus["Status"].toLowerCase()}`);
      res.send(`${recordStatus["Description"]}`);
    } else {
      res.send(`:skull_and_crossbones: Status: ${recordStatus["Status"].toUpperCase()} - ${recordStatus["Description"]}`);
    }
    res.send(`Full info om bedriften finner du hos Arbeidstilsynets sider: https://arbeidstilsynet.no/renholdsvirksomhet/${orgnr}`);
  } else {
    res.send("Fant ingen organisasjon hos arbeidstilsynet for organisasjonsnummer: " + orgnr);
    res.send("Kan du ha skrevet feil? :thinking_face:");
    return;
  }
}

function svarFraSentralGodkjenning(res, orgnr, err, data) {
  if (err && err.statusCode === 404) {
    res.send(`Bedrift med orgnr ${orgnr} finnes ikke i sentral godkjenningsregisteret`);
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
    res.send(`:thumbsup: ${name} med orgnr: ${orgnr} er godkjent i Sentral godkjenningsregisteret. Lenke til godkjenningsbevis: ${approval_certificate}.`);
  }
}

function verdiEllerDefault(verdi, defaultVerdi) {
  if (verdi) return verdi;

  return defaultVerdi;
}

export const arbeidstilsynet = (bot) => {
  bot.respond(/sjekk (\d*)/i, (res) => {
    const orgnr = res.match[1];
    if (orgnr.replace(/\s/g, "").trim().length !== 9) {
      res.send("Organisasjonsnummer må være 9 siffer. Prøv igjen :recycle:");
      return;
    }
    if (orgnr) {
      res.send("Sjekker bedrift hos arbeidstilsynet for deg...");
      service.sjekkBedrift(orgnr, (err, data) => {
        svarFraArbeidstilsynet(res, orgnr, err, data);
        res.send("\n----------------------------------\n")
        res.send("Sjekker bedrift hos sentral godkjenning...");
        service.sjekkSentralGodkjenning(orgnr, (sentralError, sentralData) => {
          svarFraSentralGodkjenning(res, orgnr, sentralError, sentralData);
        })
      });

    }
  });
};