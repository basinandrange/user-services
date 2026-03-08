const express = require('express');
const users = require('../services/users');

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

router.post('/create', handle((req) => users.create(req.body)));

router.get('/get', handle(() => users.getAll()));

router.put('/update', handle((req) => users.update(req.query.id, req.body)));

router.patch('/update', handle((req) => users.copy(req.query.id)));

router.delete('/delete', handle((req) => users.delete(req.query.id)));

module.exports = router;
