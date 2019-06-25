"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vaeret = void 0;

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.array.map");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var yrno = require('yr.no-forecast')({
  version: '1.9',
  // this is the default if not provided,
  request: {
    // make calls to locationforecast timeout after 15 seconds
    timeout: 15000
  }
});

var LOCATION = {
  lat: 59.916597,
  lon: 10.758096
};

var konverterIkon = function konverterIkon(icon) {
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

var vaeret = function vaeret(bot) {
  var informasjon = _config.default.slackrooms.informasjon;

  var hentVaerData = function hentVaerData() {
    yrno.getWeather(LOCATION).then(function (weather) {
      weather.getFiveDaySummary().then(function (data) {
        bot.messageRoom(informasjon, 'Her er værmeldingen for Oslo de neste dagene :sunrise_over_mountains:');
        bot.messageRoom(informasjon, data.map(function (w) {
          return "".concat(new Date(w.from).toDateString(), "\n").concat(konverterIkon(w.icon), " - :thermometer: ").concat(w.temperature.value, " grader - :umbrella_with_rain_drops:  ").concat(w.rain, " regn - :wind_blowing_face: ").concat(w.windSpeed.name, " (").concat(w.windSpeed.mps, " m/s) ");
        }).join('\n\n'));
      });
    });
  };

  bot.hear(/vær/i, function (res) {
    hentVaerData();
  });
};

exports.vaeret = vaeret;