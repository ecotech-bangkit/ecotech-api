const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();

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
module.exports = { loadModel, predict };
