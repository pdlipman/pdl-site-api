const express = require('express');
const passport = require('passport');

const AuthenticationController = require('./app/controllers/authentication.js');
const ContentController = require('./app/controllers/content.js');

const passportService = require('./app/config/passport.js');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

const ROLE_ADMIN = 'Admin';
const ROLE_OWNER = 'Owner';
const ROLE_CLIENT = 'Client';
const ROLE_MEMBER = 'Member';

module.exports = function(app) {
    const apiRoutes = express.Router();
    const authRoutes = express.Router();
    const contentRoutes = express.Router();
    //=========================
    // Auth Routes
    //=========================

    // Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);

    // Registration route
    authRoutes.post('/register', AuthenticationController.register);

    // Login route
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    // Test protected route
    apiRoutes.get('/protected', requireAuth, (req, res) => {
        res.send({ content: 'The protected test route is functional!' });
    });

    //=========================
    // Content Routes
    //=========================

    // Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/content', contentRoutes);

    contentRoutes.post(
        '/add-card',
        requireAuth,
        AuthenticationController.roleAuthorization(ROLE_ADMIN),
        ContentController.addCard
    );

    // Set url for API group routes
    app.use('/api', apiRoutes);
};
