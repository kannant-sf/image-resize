const { getLiveSessions } = require("./services");
const { processImage } = require("./utils");


const updateLiveorVodSessions = async (
  url,
  tenantIdentifier,
  type,
  thumbImageName
) => {
  console.log(`Executing for ${type}`);
  const res = await getLiveSessions(url, tenantIdentifier, {
    pageNo: 1,
    pageSize: 1,
    sortBy: "position",
    sortOrder: "asc",
    viewSession: false,
    privateClass: true,
    published: null,
    searchQuery: "",
  });

  const totalCount = res.data?.data?.count;

  console.log({ totalCount }, `${type} length`);

  const buffer = 10;
  let offset = 1;

  for (let i = 0; i < totalCount; i += buffer) {
    const res = await getLiveSessions(url, tenantIdentifier, {
      pageNo: offset,
      pageSize: buffer,
      sortBy: "position",
      sortOrder: "asc",
      viewSession: false,
      privateClass: true,
      published: null,
      searchQuery: "",
    });

    offset++;
    const contents = res?.data?.data.data;

    console.log({ contentsLen: contents.length });

    const results = await Promise.allSettled(
      contents.map(async (content) => {
        if (content?.content?.[thumbImageName]) {
          return processImage(content?.content?.[thumbImageName]);
        } else {
          return { success: true, imageName: "No image found" };
        }
      })
    );

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        if (result.value.success) {
          console.log(
            `Image ${result.value.imageName} processed successfully.`
          );
        } else {
          console.log(`Image ${result.value.imageName} failed to process.`);
        }
      } else {
        console.error(`Image processing failed: ${result.reason}`);
      }
    });
  }
};

module.exports = {
  updateLiveorVodSessions,
};
