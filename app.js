if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const app = express();
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

app.use(helmet());
app.use(cors({ origin: 'https://welder-client-rdport.onrender.com', credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
app.use(errorHandler);

module.exports = app;
