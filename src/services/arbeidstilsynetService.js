import rp from 'request-promise';
import { ARBEIDSTILSYNET_HOST_AND_PORT } from '../constants/constants';

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
                cb(`Det skjedde en feil ved henting av data for org: ${orgnr}. Enten er tjenestene til nettsiden nede, eller så er det dårlig programmering. Snakk med Sindre :man-shrugging:`, []);
            })
    }
}

export default arbeidstilsynetService;