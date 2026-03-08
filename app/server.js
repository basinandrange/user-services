const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);

app.use((req, res) => {
  res.status(404).json({ status: 404, error: 'Not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.error || err.message || 'Internal server error';
  res.status(status).json({ status, error });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `Express Server started on Port ${app.get('port')} | Environment : ${app.get('env')}`
    );
  });
}

module.exports = app;
