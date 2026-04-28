module.exports = (schema, where = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[where], { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(d => d.message),
    });
  }
  req[where] = value; // sanitize
  next();
};
