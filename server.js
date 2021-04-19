require('dotenv').config();
require('./api/database/dbconfig');
const routes = require('./api/routes')
const express = require('express');
const cors = require('cors')

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())

const  port = process.env.PORT || 3000;

app.get('/',(req, res) => {
    res.status(200).send('Well hello there');
})

routes(app);

app.listen(port,() => {
    console.log(`Established on port ${port}`);
})