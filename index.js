const { login, getTypes, getStudios, getLiveSessions } = require("./services");
const { getToken, setToken } = require("./config");
const { updateLiveorVodSessions } = require("./updateLiveVodCollection");
const { updateStudios } = require("./updateStudios");
const { updateTypes } = require("./updateTypes");

require("dotenv").config();

const records = {
  loginUrl: "https://gateway.uat.fortecloud.io/api/v1/sign-in",
  tenantIdentifier: "89888fe2-e93d-48d7-80a7-b833da24ef8d",
  typeUrl:
    "https://gateway.uat.fortecloud.io/api/content/v1/master-data/types/filter",
  studioUrl: "https://gateway.uat.fortecloud.io/api/v1/studios/filter",
  liveSessionsUrl:
    "https://gateway.uat.fortecloud.io/api/content/v1/content-entities/63f3ca6b9e984504fa6fe154/contents/filter",
  vodSessionsUrl:
    "https://gateway.uat.fortecloud.io/api/content/v1/content-entities/64414b1d8bdd0b5f3e35edf0/contents/filter",
  collectionsUrl:
    "https://gateway.uat.fortecloud.io/api/content/v1/content-entities/63f3cd709e984504fa6fe157/contents/filter",
};

const init = async () => {
  try {
    const args = process.argv.slice(2)[0];
    console.log({ args }, "Arguments");

    if (!args) throw new Error(`No tenant Identifier passed`);
    records.tenantIdentifier = args;
    const res = await login(records.loginUrl, records.tenantIdentifier);

    const token = res?.data?.data?.jwtToken?.accessToken;
    console.log({ token });
    setToken(token);

    await updateTypes(records.typeUrl, records.tenantIdentifier);
    await updateStudios(records.studioUrl, records.tenantIdentifier);
    await updateLiveorVodSessions(
      records.vodSessionsUrl,
      records.tenantIdentifier,
      "VOD",
      "thumbnail_image"
    );
    await updateLiveorVodSessions(
      records.liveSessionsUrl,
      records.tenantIdentifier,
      "LIVE",
      "thumbnail_image"
    );
    await updateLiveorVodSessions(
      records.collectionsUrl,
      records.tenantIdentifier,
      "COLLECTIONS",
      "thumbnailImage"
    );
  } catch (error) {
    console.error({ error });
  }
};

init();
