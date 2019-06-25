"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.array.filter");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.regexp.search");

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _constants = require("../constants/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('dotenv').config();

var user = null;
var kolonialEndpoints = {
  search: {
    searchForProduct: function searchForProduct(product) {
      return "/api/v1/search/?q=".concat(product);
    },
    searchForRecipesWithProduct: function searchForRecipesWithProduct(product) {
      return "/api/v1/search/recipes/?q=".concat(product);
    }
  },
  login: '/api/v1/user/login/',
  logout: '/api/v1/user/logout/',
  cart: '/api/v1/cart/'
};

var getHeaders = function getHeaders() {
  return {
    'User-Agent': process.env.KOLONIAL_USER_AGENT,
    'X-Client-Token': process.env.KOLONIAL_X_CLIENT_TOKEN
  };
};

var getLoggedInHeaders = function getLoggedInHeaders(userContext) {
  var headers = getHeaders();
  return _objectSpread({}, headers, {
    Cookie: "sessionid=".concat(userContext.sessionid)
  });
};

var getOptions = function getOptions(uri) {
  return {
    uri: uri,
    headers: getHeaders(),
    json: true
  };
};

var getLoggedInOptions = function getLoggedInOptions(uri, userContext) {
  return {
    uri: uri,
    headers: getLoggedInHeaders(userContext),
    json: true
  };
};

var getPostOptions = function getPostOptions(uri, body) {
  return {
    method: 'POST',
    uri: uri,
    headers: getHeaders(),
    body: body,
    json: true
  };
};

var getDataFromEndpoint = function getDataFromEndpoint(endpoint, cb) {
  var uri = "".concat(_constants.KOLONIAL_HOST_AND_PORT).concat(endpoint);
  var options = getOptions(uri);
  (0, _requestPromise.default)(options).then(function (data) {
    return cb(null, data);
  }).catch(function (err) {
    return cb(err, {});
  });
};

var kolonialService = {
  getRecipes: function getRecipes(product, cb) {
    getDataFromEndpoint(kolonialEndpoints.search.searchForRecipesWithProduct(encodeURI(product)), cb);
  },
  search: function search(product, cb) {
    getDataFromEndpoint(kolonialEndpoints.search.searchForProduct(encodeURI(product)), cb);
  },
  login: function login(cb) {
    var uri = "".concat(_constants.KOLONIAL_HOST_AND_PORT).concat(kolonialEndpoints.login);
    var options = getPostOptions(uri, {
      username: process.env.KOLONIAL_USERNAME,
      password: process.env.KOLONIAL_PASSWORD
    });
    (0, _requestPromise.default)(options).then(function (data) {
      user = data;
      cb(null, data);
    }).catch(function (err) {
      return cb(err, {});
    });
  },
  logout: function logout(cb) {
    user = null;
    var uri = "".concat(_constants.KOLONIAL_HOST_AND_PORT).concat(kolonialEndpoints.logout);
    var options = getPostOptions(uri, {});
    (0, _requestPromise.default)(options).then(function (data) {
      cb(null, data);
    }).catch(function (err) {
      return cb(err, {});
    });
  },
  getCart: function getCart(cb) {
    var uri = "".concat(_constants.KOLONIAL_HOST_AND_PORT).concat(kolonialEndpoints.cart);

    if (!user) {
      console.log('#### INGEN BRUKER HER ####');
      cb({
        statusCode: 401,
        message: 'Du må være logget inn for å se innholdet i handlekurven'
      }, {});
      return;
    }

    var options = getLoggedInOptions(uri, user);
    (0, _requestPromise.default)(options).then(function (data) {
      console.log('DATA:', data);
      cb(null, data);
    }).catch(function (err) {
      return cb(err, {});
    });
  }
};
var _default = kolonialService;
exports.default = _default;