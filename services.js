const { default: axios } = require("axios");
const { getToken } = require("./config");
const { processImage } = require("./utils");
require("dotenv").config();

const email = process.env.email;
const password = process.env.password;

const login = (URL, tenantIdentifier) => {
  console.log({ URL });

  return axios.post(
    URL,
    { email, password },
    {
      headers: {
        tenant_identifier: tenantIdentifier,
      },
    }
  );
};

const getTypes = (URL, tenantIdentifier, params) => {
  return axios.get(URL, {
    params: params,
    headers: {
      tenant_identifier: tenantIdentifier,
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

const getStudios = (URL, tenantIdentifier, params) => {
  return axios.get(URL, {
    params: params,
    headers: {
      tenant_identifier: tenantIdentifier,
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

const getLiveSessions = (URL, tenantIdentifier, params) => {
  return axios.post(URL, params, {
    headers: {
      tenant_identifier: tenantIdentifier,
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

module.exports = {
  login,
  getTypes,
  getStudios,
  getLiveSessions,
};
