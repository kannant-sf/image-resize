const { default: axios } = require("axios");
const { getToken } = require("./config");

const login = (URL, tenantIdentifier) => {
  console.log({ URL });

  return axios.post(
    URL,
    { email: "ops@forte.fit", password: "4teSuper@dm!n" },
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
  return axios.post(
    URL,
    params ,
    {
      headers: {
        tenant_identifier: tenantIdentifier,
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
};

module.exports = {
  login,
  getTypes,
  getStudios,
  getLiveSessions
};
