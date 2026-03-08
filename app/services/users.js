const store = require('./data/store');
const { badRequest, notFound } = require('./http-error');

module.exports = {
  create(payload = {}) {
    if (!payload.firstName || !payload.lastName) {
      throw badRequest('firstName and lastName are required');
    }

    const user = store.createUser(payload);

    return {
      status: 200,
      data: {
        status: 'success',
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id
      }
    };
  },

  getAll() {
    const users = store.getAllUsers();

    return {
      status: 200,
      data: [{ status: 'success' }, ...users]
    };
  },

  update(id, payload = {}) {
    if (!id) {
      throw badRequest('id is required');
    }

    const user = store.updateUser(id, payload);

    if (!user) {
      throw notFound(`No user found for id '${id}'`);
    }

    return {
      status: 200,
      data: {
        status: 'success',
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id
      }
    };
  },

  copy(id) {
    if (!id) {
      throw badRequest('id is required');
    }

    const user = store.copyUser(id);

    if (!user) {
      throw notFound(`No user found for id '${id}'`);
    }

    return {
      status: 200,
      data: {
        status: 'success',
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id
      }
    };
  },

  delete(id) {
    if (!id) {
      throw badRequest('id is required');
    }

    const deleted = store.deleteUser(id);

    if (!deleted) {
      throw notFound(`No user found for id '${id}'`);
    }

    return {
      status: 200,
      data: {
        status: 'success',
        id
      }
    };
  }
};
