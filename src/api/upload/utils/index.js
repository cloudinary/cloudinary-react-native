import { DEFAULT_SIGNATURE_ALGORITHM } from './consts';
import { isArray } from 'util';
import * as Crypto from 'expo-crypto';

const entries = require('./entries');
const toArray = require('./toArray');


export const timestamp = () => Math.floor(new Date().getTime() / 1000);
export function present(value) {
    return value != null && ("" + value).length > 0;
}

async function sign_request(apiConfig, params, options = {}) {
  const apiKey = apiConfig.apiKey;
  const apiSecret = apiConfig.apiSecret;

  params = clear_blank(params);

  for (let key in params) {
    const value = params[key];

    if (Array.isArray(value)) {
      params[key] = value.map(v =>
        typeof v === 'string' ? v.replace(/&/g, '%26') : v
      );
    } else if (typeof value === 'string') {
      params[key] = value.replace(/&/g, '%26');
    }
  }

  params.signature = await api_sign_request(params, apiSecret);
  params.api_key = apiKey;
  return params;
}



  async function api_sign_request(params_to_sign, api_secret) {
    let to_sign = entries(params_to_sign).filter(
      ([k, v]) => present(v)
    ).map(
      ([k, v]) => `${k}=${toArray(v).join(",")}`
    ).sort().join("&");
    const signature = computeHash(
      to_sign + api_secret,
      /*APIConfig().signature_algorithm || */ DEFAULT_SIGNATURE_ALGORITHM,
      'hex'
    );
    return Promise.resolve(signature);
  }

  function clear_blank(hash) {
    let filtered_hash = {};
    entries(hash).filter(
      ([k, v]) => present(v)
    ).forEach(
      ([k, v]) => {
        filtered_hash[k] = v.filter ? v.filter(x => x) : v;
      }
    );
    return filtered_hash;
  }

  /**
 * Computes hash from input string using specified algorithm.
 * @private
 * @param {string} input string which to compute hash from
 * @param {string} signature_algorithm algorithm to use for computing hash
 * @param {string} encoding type of encoding
 * @return {string} computed hash value
 */
  async function computeHash(input, signature_algorithm, encoding) {
    let hash;

    if (signature_algorithm === 'sha256') {
      const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        input
      );
      hash = digest;
    } else if (signature_algorithm === 'sha1') {
      const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA1,
        input
      );
      hash = digest;
    }
    return hash;
  }

  export async function process_request_params(apiConfig, options) {
    let params = clear_blank(options);
    if ((options.unsigned != null) && options.unsigned) {
      params = clear_blank(options);
    //   delete params.timestamp;
    // } else if (options.oauth_token || config().oauth_token) {
    //   params = clear_blank(params);
    } else if (options.signature) {
      params = clear_blank(options);
    } else {
      params.timestamp = timestamp();
      params = await sign_request(apiConfig, params, options);
    }
    return Promise.resolve(params)
  }

  export function hashToParameters(hash) {
    return entries(hash).reduce((parameters, [key, value]) => {
      if (isArray(value)) {
        key = key.endsWith('[]') ? key : key + '[]';
        const items = value.map(v => [key, v]);
        parameters = parameters.concat(items);
      } else {
        parameters.push([key, value]);
      }
      return parameters;
    }, []);
  }
