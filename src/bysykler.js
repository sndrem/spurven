import config from './config';

export const bysykler = (bot) => {
  bot.hear(/bysykkel|sykkel/i, (res) => {
    checkBikeVacancy();
  });

  async function getData(url, callback) {
    const request = bot
      .http(url)
      .header("Accept", "application/json")
      .header("client-name", "sindrem-slacbot")
      .get();
    request((err, res, body) => {
      if (err) {
        callback(err, null);
      }
      callback(null, JSON.parse(body));
    });
  }

  function checkBikeVacancy() {
    getData(
      "https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json",
      (err, data) => {
        if (err) {
          console.log("Faen, noe feilet", err);
          bot.messageRoom(
            config.slackrooms.informasjon,
            ":white_frowning_face: Det var et problem ved henting av bysykkeldata :white_frowning_face:"
          );
        }
        const { stations } = data.data;
        const { bysykkelStativer } = config;
        const ids = bysykkelStativer.map(x => x.id);
        const filteredStations = stations.filter(station => {
          return ids.includes(station.station_id);
        });
        filteredStations.forEach(station => {
          const response = `:bike: På ${
            bysykkelStativer.find(x => x.id === station.station_id).name
            } er det ${station.num_bikes_available} ledige sykler og ${
            station.num_docks_available
            } ledige parkeringer.`;
          bot.messageRoom(config.slackrooms.informasjon, response);
        });
      }
    );
  }

};