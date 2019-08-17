"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("core-js/modules/es6.object.define-properties");

require("core-js/modules/es7.object.get-own-property-descriptors");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.array.filter");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.regexp.search");

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _constants = require("../constants/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
  cart: '/api/v1/cart/',
  leggTilICart: '/api/v1/cart/items/'
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
  (0, _requestPromise["default"])(options).then(function (data) {
    return cb(null, data);
  })["catch"](function (err) {
    return cb(err, {});
  });
};

var ingenBruker = function ingenBruker(cb) {
  console.log('#### INGEN BRUKER HER ####');
  cb({
    statusCode: 401,
    message: 'Du må være logget inn for å se innholdet i handlekurven'
  }, {});
  return;
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
    (0, _requestPromise["default"])(options).then(function (data) {
      user = data;
      cb(null, data);
    })["catch"](function (err) {
      console.log("Error ved innlogging", err);
      cb(err, {});
    });
  },
  logout: function logout(cb) {
    user = null;
    var uri = "".concat(_constants.KOLONIAL_HOST_AND_PORT).concat(kolonialEndpoints.logout);
    var options = getPostOptions(uri, {});
    (0, _requestPromise["default"])(options).then(function (data) {
      cb(null, data);
    })["catch"](function (err) {
      return cb(err, {});
    });
  },
  getCart: function getCart(cb) {
    var uri = "".concat(_constants.KOLONIAL_HOST_AND_PORT).concat(kolonialEndpoints.cart);

    if (!user) {
      return ingenBruker(cb);
    }

    var options = getLoggedInOptions(uri, user);
    (0, _requestPromise["default"])(options).then(function (data) {
      console.log('DATA:', data);
      cb(null, data);
    })["catch"](function (err) {
      return cb(err, {});
    });
  },
  leggTilICart: function leggTilICart(items, cb) {
    console.log(items);
    var uri = "".concat(_constants.KOLONIAL_HOST_AND_PORT).concat(kolonialEndpoints.leggTilICart);

    if (!user) {
      return ingenBruker(cb);
    }

    var options = getLoggedInOptions(uri, user);

    var payload = _objectSpread({}, options, {
      method: "POST",
      json: true,
      body: items
    });

    console.log(JSON.stringify(payload, null, 2));
    (0, _requestPromise["default"])(payload).then(function (data) {
      console.log("Varer lagt til i handlekurven", data);
      cb(null, data);
    })["catch"](function (err) {
      console.log("Det skjedde en feil når vi la til i carten", err);
      cb(err, {});
    });
  }
};
var _default = kolonialService;
exports["default"] = _default;