"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vaeret = void 0;

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
  // This is Dublin, Ireland
  lat: 59.916597,
  lon: 10.758096
};

var konverterIkon = function konverterIkon(icon) {
  switch (icon) {
    case 'Sun':
      return ':sunny:';

    case 'LightCloud':
      return ':cloud:';

    case 'Cloud':
      return ':cloud:';

    default:
      return icon;
  }
};

var vaeret = function vaeret(bot) {
  var samboerskapet = _config.default.slackrooms.samboerskapet;

  var hentVaerData = function hentVaerData() {
    yrno.getWeather(LOCATION).then(function (weather) {
      weather.getFiveDaySummary().then(function (data) {
        bot.messageRoom(samboerskapet, 'Her er værmeldingen for Oslo de neste dagene :sunrise_over_mountains:');
        bot.messageRoom(samboerskapet, data.map(function (w) {
          return "".concat(new Date(w.from).toDateString(), "\n").concat(konverterIkon(w.icon), " - :thermometer: ").concat(w.temperature.value, " grader - ").concat(w.rain, " regn :umbrella_with_raindrops:} - ").concat(w.windSpeed.name, " (").concat(w.windSpeed.mps, " m/s) :wind_blowing_face:");
        }).join('\n\n'));
      });
    });
  };

  bot.hear(/vær/i, function (res) {
    hentVaerData();
  });
};

exports.vaeret = vaeret;