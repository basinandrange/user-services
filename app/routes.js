module.exports = function setupRoutes(app) {
  app.use('/accounts', require('./routes/accounts.route'));
  app.use('/payments', require('./routes/payments.route'));
  app.use('/', require('./routes/users.route'));
};
