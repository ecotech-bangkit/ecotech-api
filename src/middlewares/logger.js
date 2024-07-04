const logRequest = (req, res, next) => {
  console.log('Hit API dengan tipe ' + req.method + ' pada endpoint:', req.path);
  next();
};

module.exports = logRequest;
