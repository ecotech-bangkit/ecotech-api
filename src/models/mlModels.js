const tf = require('@tensorflow/tfjs-node');

let model;

async function loadModel() {
  model = await tf.loadLayersModel('./model.json');
  console.log('Model has been loaded');
}

function predict(tensor) {
  return model.predict(tensor);
}

module.exports = { loadModel, predict };
