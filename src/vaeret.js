import config from './config';

const yrno = require('yr.no-forecast')({
  version: '1.9', // this is the default if not provided,
  request: {
    // make calls to locationforecast timeout after 15 seconds
    timeout: 15000,
  },
});

const LOCATION = {
  lat: 59.916597,
  lon: 10.758096,
};

const konverterIkon = (icon) => {
  switch (icon) {
    case 'Sun':
      return ':sunny:';
    case 'LightCloud':
      return ':cloud:';
    case 'PartlyCloud':
      return ':cloud:';
    case 'LightRainSun':
      return ':partly_sunny_rain:';
    case 'Rain':
      return ':rain_cloud:';
    case 'Snow':
      return ':snow_cloud:';
    case 'Fog':
      return ':fog:';
    case 'Cloud':
      return ':cloud:';
    default:
      return icon;
  }
};

export const vaeret = (bot) => {
  const { informasjon } = config.slackrooms;
  const hentVaerData = () => {
    yrno.getWeather(LOCATION).then((weather) => {
      weather.getFiveDaySummary().then((data) => {
        bot.messageRoom(
          informasjon,
          'Her er værmeldingen for Oslo de neste dagene :sunrise_over_mountains:',
        );
        bot.messageRoom(
          informasjon,
          data
            .map(
              w => `${new Date(w.from).toDateString()}\n${konverterIkon(
                  w.icon,
                )} - :thermometer: ${
                  w.temperature.value
                } grader - :umbrella_with_rain_drops:  ${
                  w.rain
                } regn - :wind_blowing_face: ${w.windSpeed.name} (${
                  w.windSpeed.mps
                } m/s) `,
            )
            .join('\n\n'),
        );
      });
    });
  };
  bot.hear(/vær/i, (res) => {
    hentVaerData();
  });
};
