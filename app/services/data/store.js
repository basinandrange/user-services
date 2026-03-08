const { randomUUID } = require('crypto');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function randomDigits(length) {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

const statementLatestTemplate = {
  period: 'latest',
  balance: {
    opening: 592.0,
    closing: 850.86
  },
  money: {
    in: 738.29,
    out: 166.95
  },
  transactions: [
    {
      date: 'Tue Nov 02 2021 03:12:59 GMT-0400 (Eastern Daylight Time)',
      description: 'Schroeder LLC',
      type: 'invoice',
      amount: 472.23,
      balance: 975.82
    },
    {
      date: 'Tue Nov 02 2021 07:25:47 GMT-0400 (Eastern Daylight Time)',
      description: 'Douglas LLC',
      type: 'withdrawal',
      amount: 579.54,
      balance: 478.19
    },
    {
      date: 'Tue Nov 02 2021 03:15:25 GMT-0400 (Eastern Daylight Time)',
      description: 'Schimmel, Veum and Ernser',
      type: 'payment',
      amount: 183.96,
      balance: 930.73
    },
    {
      date: 'Tue Nov 02 2021 10:23:17 GMT-0400 (Eastern Daylight Time)',
      description: 'Haley, Gislason and Yundt',
      type: 'invoice',
      amount: 41.48,
      balance: 725.33
    },
    {
      date: 'Mon Nov 01 2021 22:39:10 GMT-0400 (Eastern Daylight Time)',
      description: 'Harris, Hegmann and Sawayn',
      type: 'deposit',
      amount: 879.64,
      balance: 646.98
    },
    {
      date: 'Tue Nov 02 2021 01:31:45 GMT-0400 (Eastern Daylight Time)',
      description: 'Jacobson, Monahan and Roberts',
      type: 'withdrawal',
      amount: 582.72,
      balance: 849.03
    },
    {
      date: 'Tue Nov 02 2021 19:06:42 GMT-0400 (Eastern Daylight Time)',
      description: 'Vandervort Group',
      type: 'invoice',
      amount: 12.65,
      balance: 522.66
    },
    {
      date: 'Tue Nov 02 2021 03:08:30 GMT-0400 (Eastern Daylight Time)',
      description: 'Smitham LLC',
      type: 'withdrawal',
      amount: 279.13,
      balance: 781.56
    },
    {
      date: 'Tue Nov 02 2021 03:46:15 GMT-0400 (Eastern Daylight Time)',
      description: 'Moore LLC',
      type: 'withdrawal',
      amount: 723.63,
      balance: 544.53
    },
    {
      date: 'Tue Nov 02 2021 04:53:24 GMT-0400 (Eastern Daylight Time)',
      description: 'Predovic - Ferry',
      type: 'invoice',
      amount: 673.55,
      balance: 638.57
    }
  ]
};

const statementDateTemplate = {
  period: {
    from: 'Mon Sep 20 2021 16:52:45 GMT-0400 (Eastern Daylight Time)',
    to: 'Tue Nov 02 2021 15:13:01 GMT-0400 (Eastern Daylight Time)'
  },
  balance: {
    opening: 852.93,
    closing: 659.37
  },
  money: {
    in: 162.03,
    out: 416.14
  },
  transactions: [
    {
      date: 'Mon Nov 01 2021 21:22:46 GMT-0400 (Eastern Daylight Time)',
      description: 'Rutherford, Kuhn and Davis',
      type: 'payment',
      amount: 550.45,
      balance: 812.41
    },
    {
      date: 'Tue Nov 02 2021 17:54:35 GMT-0400 (Eastern Daylight Time)',
      description: 'Steuber, Bosco and Aufderhar',
      type: 'withdrawal',
      amount: 352.28,
      balance: 805.94
    },
    {
      date: 'Tue Nov 02 2021 00:32:22 GMT-0400 (Eastern Daylight Time)',
      description: 'Murray, Lind and Conn',
      type: 'withdrawal',
      amount: 750.29,
      balance: 380.53
    },
    {
      date: 'Tue Nov 02 2021 16:08:41 GMT-0400 (Eastern Daylight Time)',
      description: 'Ortiz - Strosin',
      type: 'withdrawal',
      amount: 907.48,
      balance: 911.39
    },
    {
      date: 'Tue Nov 02 2021 01:54:43 GMT-0400 (Eastern Daylight Time)',
      description: 'Lockman - Abbott',
      type: 'withdrawal',
      amount: 488.83,
      balance: 27.05
    },
    {
      date: 'Tue Nov 02 2021 20:56:06 GMT-0400 (Eastern Daylight Time)',
      description: 'Thiel, Labadie and Fay',
      type: 'withdrawal',
      amount: 699.06,
      balance: 494.85
    },
    {
      date: 'Tue Nov 02 2021 01:03:02 GMT-0400 (Eastern Daylight Time)',
      description: 'Mosciski - Rutherford',
      type: 'invoice',
      amount: 709.3,
      balance: 280.79
    },
    {
      date: 'Tue Nov 02 2021 06:03:08 GMT-0400 (Eastern Daylight Time)',
      description: 'Gaylord and Sons',
      type: 'deposit',
      amount: 948.75,
      balance: 410.76
    },
    {
      date: 'Tue Nov 02 2021 11:01:22 GMT-0400 (Eastern Daylight Time)',
      description: 'Heaney LLC',
      type: 'withdrawal',
      amount: 226.07,
      balance: 562.89
    },
    {
      date: 'Tue Nov 02 2021 05:15:39 GMT-0400 (Eastern Daylight Time)',
      description: 'Torphy Inc',
      type: 'payment',
      amount: 848.31,
      balance: 402.62
    }
  ]
};

const overviewTemplate = {
  type: 'Personal Loan Account',
  balance: {
    available: 632.22,
    present: 339.71
  },
  details: {
    domestic: {
      account: '49114539',
      routing: '11252386'
    },
    international: {
      bic: 'GBHULVJ1',
      iban: 'CH8572759176K0032S830'
    }
  },
  interestRate: 0.01,
  lastStatementDate: 'Tue Nov 02 2021 10:12:14 GMT-0400 (Eastern Daylight Time)'
};

const payeesTemplate = [
  { name: 'Alejandro Reichert', checking: '49519513', routing: '41858408' },
  { name: 'Sandy Funk', checking: '89056703', routing: '49713129' },
  { name: 'Aaron Metz', checking: '09806437', routing: '55100334' },
  { name: 'Darrell Bauch', checking: '85125097', routing: '09173516' },
  { name: 'Isaac Feil', checking: '20270828', routing: '35365127' },
  { name: 'Leigh Rohan', checking: '90142633', routing: '00431026' },
  { name: 'Melody Ryan', checking: '43478216', routing: '23899846' },
  { name: 'Howard Gorczany', checking: '22511905', routing: '01385400' },
  { name: 'Rudy Hackett', checking: '56305325', routing: '27537298' },
  { name: 'Denise Corkery', checking: '90846626', routing: '84234984' }
];

const accountState = new Map();
const users = new Map();

function ensureAccount(accountNumber) {
  if (!accountState.has(accountNumber)) {
    accountState.set(accountNumber, {
      statementLatest: clone(statementLatestTemplate),
      statementDate: clone(statementDateTemplate),
      overview: clone(overviewTemplate),
      payees: clone(payeesTemplate),
      limits: { daily: 30000 },
      transfers: []
    });
  }

  return accountState.get(accountNumber);
}

function seedUsers() {
  const seeded = {
    id: '0729d37c-ef9f-4ffa-8f71-a6eedf1f95b7',
    firstName: 'Ben',
    lastName: 'Smith'
  };

  users.set(seeded.id, seeded);
}

seedUsers();

module.exports = {
  createAccount(input = {}) {
    const type = input.type || 'Savings Account';
    const details = {
      domestic: {
        account: randomDigits(8),
        routing: randomDigits(8)
      },
      international: {
        bic: `${randomDigits(4)}BANK`,
        iban: `US${randomDigits(20)}`
      }
    };

    return {
      type,
      details
    };
  },

  getOverview(accountNumber) {
    const account = ensureAccount(accountNumber);
    return clone(account.overview);
  },

  getLatestStatement(accountNumber) {
    const account = ensureAccount(accountNumber);
    return clone(account.statementLatest);
  },

  getStatementByDate(accountNumber, range = {}) {
    const account = ensureAccount(accountNumber);
    const response = clone(account.statementDate);

    if (range.from || range.to) {
      response.period = {
        from: range.from || response.period.from,
        to: range.to || response.period.to
      };
    }

    return response;
  },

  listPayees(accountNumber) {
    const account = ensureAccount(accountNumber);
    return clone(account.payees);
  },

  addPayee(accountNumber, payload = {}) {
    const account = ensureAccount(accountNumber);
    const payee = {
      payeeId: randomUUID(),
      name: payload.name || 'New Payee',
      checking: payload.checking || randomDigits(8),
      routing: payload.routing || randomDigits(8)
    };

    account.payees.push(payee);
    return { payeeId: payee.payeeId };
  },

  getLimit(accountNumber) {
    const account = ensureAccount(accountNumber);
    return clone(account.limits);
  },

  updateLimit(accountNumber, daily) {
    const account = ensureAccount(accountNumber);
    account.limits = { daily };
    return { status: 'success' };
  },

  transfer(accountNumber, payload = {}) {
    const account = ensureAccount(accountNumber);
    account.transfers.push({
      id: randomUUID(),
      payeeId: payload.payeeId,
      amount: payload.amount,
      reference: payload.reference,
      date: payload.date || new Date().toISOString()
    });

    return { transaction: 'complete' };
  },

  createUser(payload = {}) {
    const user = {
      id: randomUUID(),
      firstName: payload.firstName,
      lastName: payload.lastName
    };

    if (payload.password) {
      user.password = payload.password;
    }

    users.set(user.id, user);
    return clone(user);
  },

  getAllUsers() {
    return Array.from(users.values()).map((user) => clone(user));
  },

  updateUser(id, payload = {}) {
    const existing = users.get(id);

    if (!existing) {
      return null;
    }

    if (typeof payload.firstName === 'string' && payload.firstName.length > 0) {
      existing.firstName = payload.firstName;
    }

    if (typeof payload.lastName === 'string' && payload.lastName.length > 0) {
      existing.lastName = payload.lastName;
    }

    if (typeof payload.password === 'string' && payload.password.length > 0) {
      existing.password = payload.password;
    }

    users.set(id, existing);
    return clone(existing);
  },

  copyUser(id) {
    const existing = users.get(id);

    if (!existing) {
      return null;
    }

    const copied = {
      ...clone(existing),
      id: randomUUID()
    };

    users.set(copied.id, copied);
    return copied;
  },

  deleteUser(id) {
    return users.delete(id);
  }
};
