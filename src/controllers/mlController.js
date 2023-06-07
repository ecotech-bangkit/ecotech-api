const { createCanvas, loadImage } = require('canvas');
const tf = require('@tensorflow/tfjs-node');
const ImageModel = require('../models/mlModels');

async function predict(req, res) {
  try {
    const image = await loadImage(req.file.path);
    const canvas = createCanvas(256, 256);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, 256, 256);

    const tensor = tf.browser.fromPixels(canvas).toFloat().expandDims();
    const predictions = ImageModel.predict(tensor).arraySync()[0];
    const probability = predictions[0];

    res.json({ probability });

    console.log('Prediction:', probability);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
}

module.exports = { predict };
