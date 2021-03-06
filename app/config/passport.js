const passport = require('passport');
const User = require('../models/user.js');
const config = require('./config.js');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    User.findOne({
        email: email,
    }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false,
                {
                    error: 'Authentication failed. Login details can not be verified.',
                });
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if (!isMatch) {
                return done(null, false,
                    {
                        error: 'Authentication failed. Login details can not be verified.',
                    });
            }

            return done(null, user);
        });
    });
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: config.secret,
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    User.findById(payload._id, function(err, user) {
        if (err) { return done(err); }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);
