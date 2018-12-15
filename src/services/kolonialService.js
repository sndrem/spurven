import rp from 'request-promise';
import { KOLONIAL_HOST_AND_PORT } from '../constants/constants';

require('dotenv').config();

const kolonialEndpoints = {
  search: {
    searchForProduct: product => `/api/v1/search/?q=${product}`,
    searchForRecipesWithProduct: product => `/api/v1/search/recipes/?q=${product}`,
  },
};

const getOptions = uri => ({
  uri,
  headers: {
    'User-Agent': process.env.KOLONIAL_USER_AGENT,
    'X-Client-Token': process.env.KOLONIAL_X_CLIENT_TOKEN,
  },
  json: true,
});

const kolonialService = {
  getRecipes: (product, cb) => {
    const uri = `${KOLONIAL_HOST_AND_PORT}/${kolonialEndpoints.search.searchForRecipesWithProduct(
      product,
    )}`;
    const options = getOptions(uri);
    rp(options)
      .then(data => cb(null, data))
      .catch(err => cb(err, {}));
  },
  search: (product, cb) => {
    const uri = `${KOLONIAL_HOST_AND_PORT}/${kolonialEndpoints.search.searchForProduct(
      product,
    )}`;
    const options = getOptions(uri);
    rp(options)
      .then(data => cb(null, data))
      .catch(err => cb(err, {}));
  },
};

export default kolonialService;
