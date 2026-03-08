const express = require('express');
const payments = require('../services/payments');

const router = express.Router();

function handle(serviceCall) {
  return (req, res, next) => {
    try {
      const result = serviceCall(req);
      res.status(result.status || 200).json(result.data);
    } catch (err) {
      next(err);
    }
  };
}

router.get(
  '/:accountNumber/payees',
  handle((req) => payments.listPayees(req.params.accountNumber))
);

router.post(
  '/:accountNumber/payees/add',
  handle((req) => payments.addPayee(req.params.accountNumber, req.body))
);

router.get(
  '/:accountNumber/limits',
  handle((req) => payments.getCurrentLimit(req.params.accountNumber))
);

router.put(
  '/:accountNumber/limits',
  handle((req) => {
    const payload = { ...req.body };

    if (typeof payload.daily === 'string') {
      payload.daily = Number(payload.daily);
    }

    return payments.updateLimit(req.params.accountNumber, payload);
  })
);

router.post(
  '/:accountNumber/transfer',
  handle((req) => payments.transfer(req.params.accountNumber, req.body))
);

module.exports = router;
