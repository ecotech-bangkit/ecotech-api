const { createCanvas, loadImage } = require('canvas');
const tf = require('@tensorflow/tfjs-node');
const { predict } = require('../models/mlModel');

class MLController {
  async predict(req, res) {
    try {
      const image = await loadImage(req.file.path);
      const canvas = createCanvas(256, 256);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, 256, 256);

      const tensor = tf.browser.fromPixels(canvas).expandDims();
      const predictions = await predict(tensor);
      const probability = predictions[0];

      const result = {
        statusCode: 200,
        probability: probability.toFixed(2),
        prediction: probability >= 0.5 ? "This is not categorized as e-waste, you can't send to collector." : 'This is an e-waste, you can send to collector!',
      };

      res.json(result);

      console.log('Prediction:', result);
    } catch (error) {
      console.error('Prediction error:', error);
      res.status(500).json({ error: 'Failed to process image' });
    }
  }
}

module.exports = new MLController();
