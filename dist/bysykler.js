"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bysykler = void 0;

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

require("core-js/modules/es6.array.find");

require("core-js/modules/es6.function.name");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es6.array.filter");

require("core-js/modules/es6.array.map");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var bysykler = function bysykler(bot) {
  bot.hear(/bysykkel|sykkel/i, function (res) {
    checkBikeVacancy();
  });

  function getData(_x, _x2) {
    return _getData.apply(this, arguments);
  }

  function _getData() {
    _getData = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(url, callback) {
      var request;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              request = bot.http(url).header("Accept", "application/json").header("client-name", "sindrem-slacbot").get();
              request(function (err, res, body) {
                if (err) {
                  callback(err, null);
                }

                callback(null, JSON.parse(body));
              });

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
    return _getData.apply(this, arguments);
  }

  function checkBikeVacancy() {
    getData("https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json", function (err, data) {
      if (err) {
        bot.messageRoom(_config.default.slackrooms.informasjon, ":white_frowning_face: Det var et problem ved henting av bysykkeldata :white_frowning_face:");
      }

      var stations = data.data.stations;
      var bysykkelStativer = _config.default.bysykkelStativer;
      var ids = bysykkelStativer.map(function (x) {
        return x.id;
      });
      var filteredStations = stations.filter(function (station) {
        return ids.includes(station.station_id);
      });
      filteredStations.forEach(function (station) {
        var response = ":bike: P\xE5 ".concat(bysykkelStativer.find(function (x) {
          return x.id === station.station_id;
        }).name, " er det ").concat(station.num_bikes_available, " ledige sykler og ").concat(station.num_docks_available, " ledige parkeringer.");
        bot.messageRoom(_config.default.slackrooms.informasjon, response);
      });
    });
  }
};

exports.bysykler = bysykler;