const tf = require('@tensorflow/tfjs-node');
const { Storage } = require('@google-cloud/storage');
require('dotenv').config();
const storage = new Storage();
// const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME;

let model;

async function loadModel() {
  if (!model) {
    const modelPath = './src/models/model.json'; // Ubah path model.json sesuai dengan lokasi file di proyek

    model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log('Model has been loaded');
  }
  return model;
}

async function predict(tensor) {
  const loadedModel = await loadModel();
  const predictions = loadedModel.predict(tensor);
  const probabilities = Array.from(predictions.dataSync()); // Mengubah predictions menjadi array menggunakan dataSync()
  return probabilities;
}
// async function uploadImageToStorage(fileBuffer) {
//   const bucketName = GCS_BUCKET_NAME;
//   const bucket = storage.bucket(bucketName);
//   const timestamp = Date.now();
//   const fileName = `${timestamp}.jpg`;
//   const file = bucket.file(fileName);

//   await file.save(fileBuffer, {
//     metadata: {
//       contentType: 'image/jpeg', // Sesuaikan dengan tipe file gambar yang diunggah
//     },
//     resumable: false,
//   });

//   console.log(`Image ${fileName} uploaded to Google Cloud Storage`);
// }
module.exports = { loadModel, predict };
