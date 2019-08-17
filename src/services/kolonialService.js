import rp from 'request-promise';
import { KOLONIAL_HOST_AND_PORT } from '../constants/constants';

require('dotenv').config();

let user = null;

const kolonialEndpoints = {
  search: {
    searchForProduct: product => `/api/v1/search/?q=${product}`,
    searchForRecipesWithProduct: product => `/api/v1/search/recipes/?q=${product}`,
  },
  login: '/api/v1/user/login/',
  logout: '/api/v1/user/logout/',
  cart: '/api/v1/cart/',
  leggTilICart: '/api/v1/cart/items/'
};

const getHeaders = () => ({
  'User-Agent': process.env.KOLONIAL_USER_AGENT,
  'X-Client-Token': process.env.KOLONIAL_X_CLIENT_TOKEN,
});

const getLoggedInHeaders = (userContext) => {
  const headers = getHeaders();
  return { ...headers, Cookie: `sessionid=${userContext.sessionid}` };
};

const getOptions = uri => ({
  uri,
  headers: getHeaders(),
  json: true,
});

const getLoggedInOptions = (uri, userContext) => ({
  uri,
  headers: getLoggedInHeaders(userContext),
  json: true,
});

const getPostOptions = (uri, body) => ({
  method: 'POST',
  uri,
  headers: getHeaders(),
  body,
  json: true,
});

const getDataFromEndpoint = (endpoint, cb) => {
  const uri = `${KOLONIAL_HOST_AND_PORT}${endpoint}`;
  const options = getOptions(uri);
  rp(options)
    .then(data => cb(null, data))
    .catch(err => cb(err, {}));
};

const ingenBruker = cb => {
  console.log('#### INGEN BRUKER HER ####');
  cb(
    { statusCode: 401, message: 'Du må være logget inn for å se innholdet i handlekurven' },
    {},
  );
  return;
}

const kolonialService = {
  getRecipes: (product, cb) => {
    getDataFromEndpoint(
      kolonialEndpoints.search.searchForRecipesWithProduct(encodeURI(product)),
      cb,
    );
  },
  search: (product, cb) => {
    getDataFromEndpoint(kolonialEndpoints.search.searchForProduct(encodeURI(product)), cb);
  },
  login: (cb) => {
    const uri = `${KOLONIAL_HOST_AND_PORT}${kolonialEndpoints.login}`;
    const options = getPostOptions(uri, {
      username: process.env.KOLONIAL_USERNAME,
      password: process.env.KOLONIAL_PASSWORD,
    });
    rp(options)
      .then((data) => {
        user = data;
        cb(null, data);
      })
      .catch(err => {
        console.log("Error ved innlogging", err);
        cb(err, {});
      });
  },
  logout: (cb) => {
    user = null;
    const uri = `${KOLONIAL_HOST_AND_PORT}${kolonialEndpoints.logout}`;
    const options = getPostOptions(uri, {});
    rp(options)
      .then((data) => {
        cb(null, data);
      })
      .catch(err => cb(err, {}));
  },
  getCart: (cb) => {
    const uri = `${KOLONIAL_HOST_AND_PORT}${kolonialEndpoints.cart}`;
    if (!user) {
      return ingenBruker(cb);
    }
    const options = getLoggedInOptions(uri, user);
    rp(options)
      .then((data) => {
        console.log('DATA:', data);
        cb(null, data);
      })
      .catch(err => cb(err, {}));
  },
  leggTilICart: (items, cb) => {
    console.log(items);
    const uri = `${KOLONIAL_HOST_AND_PORT}${kolonialEndpoints.leggTilICart}`;
    if (!user) {
      return ingenBruker(cb);
    }
    const options = getLoggedInOptions(uri, user);
    const payload = {
      ...options,
      method: "POST",
      json: true,
      body: items
    };
    console.log(JSON.stringify(payload, null, 2));
    rp(payload)
      .then(data => {
        console.log("Varer lagt til i handlekurven", data);
        cb(null, data);
      })
      .catch(err => {
        console.log("Det skjedde en feil når vi la til i carten", err);
        cb(err, {});
      });

  }
};

export default kolonialService;
