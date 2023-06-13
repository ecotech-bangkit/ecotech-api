'use strict';
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const pathKey = path.resolve('./serviceaccountkey.json');

// Inisialisasi Google Cloud Storage
const gcs = new Storage({
  projectId: 'capstone-project-c23-ps236',
  keyFilename: pathKey,
});
const bucketName = 'ecotech-storage';
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

let ImgUpload = {};

ImgUpload.uploadToGcs = (req, res, next) => {
  if (!req.file) return next();

  const gcsname = `${Date.now()}-${req.file.originalname}`;
  const file = bucket.file(gcsname);
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
    resumable: false,
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });
  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });

  stream.end(req.file.buffer);
};

module.exports = ImgUpload;
