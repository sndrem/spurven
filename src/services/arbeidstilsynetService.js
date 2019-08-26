import rp from 'request-promise';
import { ARBEIDSTILSYNET_HOST_AND_PORT, SENTRAL_GODKJENNING_HOST_AND_PORT, ENHETSREGISTERET_HOST_AND_PORT } from '../constants/constants';

const arbeidstilsynetService = {
    sjekkBedrift: (orgnr, cb) => {
        rp.get(`${ARBEIDSTILSYNET_HOST_AND_PORT}?query=${orgnr}`)
            .then(data => {
                if (data.length > 0) {
                    cb(null, JSON.parse(data));
                } else {
                    cb(`Fant ingen bedrifter på orgnr: ${orgnr}`, []);
                }
            })
            .catch(error => {
                cb(`Det skjedde en feil ved henting av data for org: ${orgnr}. Enten er tjenestene til arbeidstilsynet nede, eller så er det dårlig programmering. Snakk med Sindre :man-shrugging:`, []);
            })
    },
    sjekkSentralGodkjenning: (orgnr, cb) => {
        rp.get(`${SENTRAL_GODKJENNING_HOST_AND_PORT}/${orgnr}`)
            .then(data => {
                cb(null, JSON.parse(data));
            })
            .catch(error => {
                cb(error, []);
            })
    },
    sjekkEnhetsregisteret: (orgnr, cb) => {
        rp.get(`${ENHETSREGISTERET_HOST_AND_PORT}?organisasjonsnummer=${orgnr}`)
            .then(data => {
                cb(null, JSON.parse(data))
            })
            .catch(error => {
                cb(error, []);
            })
    }
}

export default arbeidstilsynetService;