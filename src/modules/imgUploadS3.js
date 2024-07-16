const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadImageToS3 = (fileBuffer, fileName, mimeType) => {
  const params = {
    Bucket: 'your-bucket-name',
    Key: `images/${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  return s3.upload(params).promise();
};
