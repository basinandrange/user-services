function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

module.exports = {
  badRequest(message) {
    return createError(400, message);
  },

  notFound(message) {
    return createError(404, message);
  }
};
