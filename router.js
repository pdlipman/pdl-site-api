const express = require('express');
const passport = require('passport');

const AuthenticationController = require('./app/controllers/authentication.js');
const passportService = require('./app/config/passport.js');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

const REQUIRE_ADMIN = 'Admin';
const REQUIRE_OWNER = 'Owner';
const REQUIRE_CLIENT = 'Client';
const REQUIRE_MEMBER = 'Member';

module.exports = function(app) {
    const apiRoutes = express.Router();
    const authRoutes = express.Router();
    //=========================
    // Auth Routes
    //=========================

    // Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);

    // Registration route
    authRoutes.post('/register', AuthenticationController.register);

    // Login route
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    // Set url for API group routes
    app.use('/api', apiRoutes);
};
