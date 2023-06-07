const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const modelPath = '.model.json';
const app = express();

let model;

async function loadModel() {
  model = await tf.loadLayersModel(`file://${modelPath}`);
  console.log('Model has been loaded');
}
loadModel();

app.post('/predict', (req, res) => {
  const inputData = req.body;
  // Preprocess the input data if necessary
  // ...

  // Perform predictions using the loaded model
  const predictions = model.predict(inputData);

  // Process the predictions and format the response
  const formattedPredictions = processPredictions(predictions);

  // Return the formatted predictions as the API response
  res.json(formattedPredictions);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

module.exports = loadModel;
