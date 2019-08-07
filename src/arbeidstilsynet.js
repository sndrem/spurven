import service from './services/arbeidstilsynetService';

export const arbeidstilsynet = (bot) => {
  bot.respond(/sjekk (\d*)/i, (res) => {
    const orgnr = res.match[1];
    if (orgnr.trim().length !== 9) {
      res.send("Organisasjonsnummer må være 9 siffer. Prøv igjen :recycle:");
      return;
    }
    if (orgnr) {
      res.send("Sjekker bedrift for deg...");
      service.sjekkBedrift(orgnr, (err, data) => {
        if (err) {
          res.send(err);
          return;
        }

        if (data.length === 0) {
          res.send(`Fant ingen organisasjoner med orgnr: ${orgnr}`);
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
      });
    }
  });

};