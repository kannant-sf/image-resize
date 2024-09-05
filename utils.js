const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const bucket = process.env.S3_BUCKET;
const cloudFrontURL = process.env.CLOUDFRONT_URL;

const client = new S3Client({ region: process.env.AWS_REGION });

const successLogPath = path.join(__dirname, "success.log");
const errorLogPath = path.join(__dirname, "error.log");

const logSuccess = (message) => {
  fs.appendFileSync(
    successLogPath,
    `${new Date().toISOString()} - ${message}\n`
  );
};

const logError = (message) => {
  fs.appendFileSync(errorLogPath, `${new Date().toISOString()} - ${message}\n`);
};

const processImage = async (thumbnailImage) => {
  const imageURL = `${cloudFrontURL}/${thumbnailImage}`;
  const key = thumbnailImage.slice(0, thumbnailImage.lastIndexOf("/"));
  const imageFormat = thumbnailImage.split(".").pop();
  const imageName = thumbnailImage.slice(
    thumbnailImage.lastIndexOf("/") + 1,
    thumbnailImage.lastIndexOf(".")
  );

  const image = await Jimp.read(imageURL);
  const imageSizes = [100, 400, 1000];
  const images = imageSizes.map((size) => ({
    data: image.clone().resize(size, size),
    imageName: `${imageName}_${size}.${imageFormat}`,
    imageFormat,
  }));

  let uploadSuccess = true;

  const uploadResults = await Promise.allSettled(
    images.map((img) =>
      uploadToS3(img.data, img.imageName, img.imageFormat, bucket, key)
    )
  );

  uploadResults.forEach((result, index) => {
    if (result.status === "fulfilled") {
      const successMsg = `Image ${images[index].imageName} uploaded successfully.`;
      logSuccess(successMsg);
      console.log(successMsg);
    } else {
      const errorMsg = `Image ${images[index].imageName} failed to upload: ${result.reason}`;
      logError(errorMsg);
      console.error(errorMsg);
      uploadSuccess = false;
    }
  });

  return { success: uploadSuccess, imageName };
};

const getFormat = (format) => {
  switch (format) {
    case "png":
      return Jimp.MIME_PNG;
    case "jpg":
    case "jpeg":
      return Jimp.MIME_JPEG;
    case "bmp":
      return Jimp.MIME_BMP;
    default:
      throw new Error(`Unsupported image format: ${format}`);
  }
};

const uploadToS3 = async (image, imageName, imageFormat, bucket, key) => {
  const bufferFormat = getFormat(imageFormat);
  const buffer = await image.getBufferAsync(bufferFormat);

  const params = {
    Bucket: bucket,
    Key: `${key}/${imageName}`,
    Body: buffer,
    ContentType: bufferFormat,
  };

  const command = new PutObjectCommand(params);
  return client.send(command);
};

module.exports = { processImage, logSuccess, logError };
