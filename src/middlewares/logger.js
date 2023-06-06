const logRequest = (req, res, next) => {
  console.log('Terdapat Request ' + req.method + ' pada endpoint:', req.path);
  next();
};

module.exports = logRequest;
