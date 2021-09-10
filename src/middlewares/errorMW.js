const apiError = (error, _req, res, _next) => {
  console.log('entrou no mw de erro', error);
  return res.status(error.errorCode || 500).json({ message: error.message });
};

module.exports = apiError;
