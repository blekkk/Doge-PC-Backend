require('dotenv').config({ path: '../../.env' });
const mongo = require('mongoose');

const uri = process.env.DATABASE_URI;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongo.connect(uri, options, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Database connection established!');
  }
});
