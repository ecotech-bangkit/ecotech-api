const tf = require('@tensorflow/tfjs-node');

let model;

async function loadModel() {
  if (!model) {
    model = await tf.loadLayersModel('file://./src/models/model.json');
    console.log('Model has been loaded');
  }
  return model;
}
async function predict(tensor) {
  const loadedModel = await loadModel();
  const predictions = loadedModel.predict(tensor);
  return predictions.array();
}
module.exports = { loadModel, predict };
