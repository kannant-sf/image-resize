// config.js
let token = "";

const setToken = (newValue) => {
  token = newValue;
};

const getToken = () => {
  return token;
};

module.exports = {
    setToken,
    getToken,
};
