const { createCanvas, loadImage } = require('canvas');
const tf = require('@tensorflow/tfjs-node');
const { loadModel } = require('../models/mlModel');
const ImgUpload = require('../modules/imgUpload');

class MLController {
  async predict(req, res) {
    try {
      const image = await loadImage(req.file.path);
      const canvas = createCanvas(256, 256);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, 256, 256);

      const tensor = tf.browser.fromPixels(canvas).expandDims();
      const loadedModel = await loadModel();
      const predictions = loadedModel.predict(tensor);
      const probability = predictions.dataSync()[0];

      const result = {
        statusCode: 200,
        probability: probability.toFixed(2),
        prediction: probability >= 0.5 ? "This is not categorized as e-waste, you can't send it to the collector." : 'This is an e-waste, you can send it to the collector!',
      };

      // Upload gambar yang telah diprediksi ke Google Cloud Storage
      await ImgUpload.uploadToGcs(req.file.buffer, `${Date.now()}-predicted.jpg`);

      res.json(result);
    } catch (error) {
      console.error('Prediction error:', error);
      res.status(500).json({ error: 'Failed to process image' });
    }
  }
}

module.exports = new MLController();
