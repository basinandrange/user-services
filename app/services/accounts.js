const store = require('./data/store');
const { badRequest } = require('./http-error');

module.exports = {
  getLatest(accountNumber) {
    if (!accountNumber) {
      throw badRequest('accountNumber is required');
    }

    return {
      status: 200,
      data: store.getLatestStatement(accountNumber)
    };
  },

  getDate(accountNumber, query = {}) {
    if (!accountNumber) {
      throw badRequest('accountNumber is required');
    }

    return {
      status: 200,
      data: store.getStatementByDate(accountNumber, {
        from: query.from,
        to: query.to
      })
    };
  },

  getOverview(accountNumber) {
    if (!accountNumber) {
      throw badRequest('accountNumber is required');
    }

    return {
      status: 200,
      data: store.getOverview(accountNumber)
    };
  },

  create(payload = {}) {
    return {
      status: 201,
      data: store.createAccount(payload)
    };
  }
};
