require('dotenv').config();
const db = require('./api/database/dbconfig');
const routes = require('./api/routes');
const express = require('express');
const cors = require('cors');

db.run();

const app = express();
const corsOptions = {
  // origin: process.env.ORIGIN,
  exposedHeaders: ['auth-token']
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).send('Well hello there');
});

routes(app);

app.listen(port, () => {
  console.log(`Established on port ${port}`);
});