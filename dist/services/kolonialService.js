"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _constants = require("../constants/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var kolonialEndpoints = {
  search: {
    searchForProduct: function searchForProduct(product) {
      return "/api/v1/search/?q=".concat(product);
    },
    searchForRecipesWithProduct: function searchForRecipesWithProduct(product) {
      return "/api/v1/search/recipes/?q=".concat(product);
    }
  }
};

var getOptions = function getOptions(uri) {
  return {
    uri: uri,
    headers: {
      'User-Agent': process.env.KOLONIAL_USER_AGENT,
      'X-Client-Token': process.env.KOLONIAL_X_CLIENT_TOKEN
    },
    json: true
  };
};

var kolonialService = {
  getRecipes: function getRecipes(product, cb) {
    var uri = "".concat(_constants.KOLONIAL_HOST_AND_PORT, "/").concat(kolonialEndpoints.search.searchForRecipesWithProduct(product));
    var options = getOptions(uri);
    (0, _requestPromise.default)(options).then(function (data) {
      return cb(null, data);
    }).catch(function (err) {
      return cb(err, {});
    });
  },
  search: function search(product, cb) {
    var uri = "".concat(_constants.KOLONIAL_HOST_AND_PORT, "/").concat(kolonialEndpoints.search.searchForProduct(product));
    var options = getOptions(uri);
    (0, _requestPromise.default)(options).then(function (data) {
      return cb(null, data);
    }).catch(function (err) {
      return cb(err, {});
    });
  }
};
var _default = kolonialService;
exports.default = _default;