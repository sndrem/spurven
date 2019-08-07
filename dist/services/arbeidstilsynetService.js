"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _constants = require("../constants/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var arbeidstilsynetService = {
  sjekkBedrift: function sjekkBedrift(orgnr, cb) {
    _requestPromise.default.get("".concat(_constants.ARBEIDSTILSYNET_HOST_AND_PORT, "?query=").concat(orgnr)).then(function (data) {
      if (data.length > 0) {
        cb(null, JSON.parse(data));
      } else {
        cb("Fant ingen bedrifter p\xE5 orgnr: ".concat(orgnr), []);
      }
    }).catch(function (error) {
      cb("Det skjedde en feil ved henting av data for org: ".concat(orgnr, ". Enten er tjenestene til nettsiden nede, eller s\xE5 er det d\xE5rlig programmering. Snakk med Sindre :man-shrugging:"), []);
    });
  }
};
var _default = arbeidstilsynetService;
exports.default = _default;