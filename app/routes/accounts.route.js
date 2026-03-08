const express = require('express');
const accounts = require('../services/accounts');

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
  '/:accountNumber/statement/latest',
  handle((req) => accounts.getLatest(req.params.accountNumber))
);

router.get(
  '/:accountNumber/statement/date',
  handle((req) => accounts.getDate(req.params.accountNumber, req.query))
);

router.get(
  '/:accountNumber/overview',
  handle((req) => accounts.getOverview(req.params.accountNumber))
);

router.post('/create', handle((req) => accounts.create(req.body)));

module.exports = router;
