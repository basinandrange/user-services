const store = require('./data/store');
const { badRequest } = require('./http-error');

module.exports = {
  listPayees(accountNumber) {
    if (!accountNumber) {
      throw badRequest('accountNumber is required');
    }

    return {
      // Matches the status code defined in user-services/index.yaml
      status: 500,
      data: store.listPayees(accountNumber)
    };
  },

  addPayee(accountNumber, payload = {}) {
    if (!accountNumber) {
      throw badRequest('accountNumber is required');
    }

    return {
      status: 200,
      data: store.addPayee(accountNumber, payload)
    };
  },

  getCurrentLimit(accountNumber) {
    if (!accountNumber) {
      throw badRequest('accountNumber is required');
    }

    return {
      // Matches the status code defined in user-services/index.yaml
      status: 500,
      data: store.getLimit(accountNumber)
    };
  },

  updateLimit(accountNumber, payload = {}) {
    if (!accountNumber) {
      throw badRequest('accountNumber is required');
    }

    const { daily } = payload;

    if (typeof daily !== 'number') {
      throw badRequest('daily must be a number');
    }

    return {
      status: 200,
      data: store.updateLimit(accountNumber, daily)
    };
  },

  transfer(accountNumber, payload = {}) {
    if (!accountNumber) {
      throw badRequest('accountNumber is required');
    }

    return {
      // Matches the status code defined in user-services/index.yaml
      status: 500,
      data: store.transfer(accountNumber, payload)
    };
  }
};
