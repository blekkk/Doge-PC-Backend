'use strict'

const userRoute = require('./database/routes/userRoutes')

module.exports = (app) => {

    userRoute(app);
    
}