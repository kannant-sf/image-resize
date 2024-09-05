const { getTypes } = require("./services");
const { processImage, logError, logSuccess } = require("./utils");

const updateTypes = async (url, tenantIdentifier) => {
  try {
    const res = await getTypes(url, tenantIdentifier, {
      limit: 1,
      offset: 0,
      active: false,
    });

    const totalCount = res?.data?.data?.totalElements;
    const totalPages = res?.data?.data?.totalPages;
    console.log({ totalCount }, "Types length");

    const buffer = 10;
    let offset = 0;
    for (let i = 0; i < totalPages; i++) {
      const params = {
        offset,
        limit: buffer,
        active: false,
      };
      const res = await getTypes(url, tenantIdentifier, params);
      offset++;
      const contents = res?.data?.data?.content;

      const results = await Promise.allSettled(
        contents.map(async (content) => {
          if (content.thumbnailImage) {
            return processImage(content.thumbnailImage);
          } else {
            return { success: true, imageName: "No image found" };
          }
        })
      );

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          if (result.value.success) {
            const successMsg = `Image ${result.value.imageName} processed successfully.`;
            logSuccess(successMsg);
            console.log(successMsg);
          } else {
            const errorMsg = `Image ${result.value.imageName} failed to process.`;
            logError(errorMsg);
            console.log(errorMsg);
          }
        } else {
          const errorMsg = `Image processing failed: ${result.reason}`;
          logError(errorMsg);
          console.log(errorMsg);
        }
      });
    }
  } catch (error) {
    console.error("Error updating types:", error);
  }
};

module.exports = {
  updateTypes,
};
