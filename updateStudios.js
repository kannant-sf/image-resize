const { getStudios } = require("./services");
const { processImage } = require("./utils");

const updateStudios = async (url, tenantIdentifier) => {
  const res = await getStudios(url, tenantIdentifier, {
    length: 10,
    start: 0,
    sortBy: "position",
    sortOrder: "asc",
  });

  const totalCount = res?.data?.count;

  console.log({ totalCount }, "Studios length");

  const buffer = 10;
  for (let i = 0; i < totalCount; i += buffer) {
    let params = {
      length: buffer,
      start: i,
      sortBy: "position",
      sortOrder: "asc",
    };
    const res = await getStudios(url, tenantIdentifier, params);

    const contents = res?.data?.data;

    console.log({ contents: contents.length });

    const results = await Promise.allSettled(
      contents.map(async (content) => {
        if (content.thumbImageUrl) {
          return processImage(content.thumbImageUrl);
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
    updateStudios
}
