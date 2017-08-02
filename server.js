/**
 * Created by philiplipman on 7/29/17.
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const config = require('./config');
const User = require('./app/models/user');

const port = process.env.PORT || 8080;
const ONE_DAY_IN_SECONDS = 60*60*24;

const app = express();

// const allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//
//     // intercept OPTIONS method
//     if ('OPTIONS' == req.method) {
//         res.send(200);
//     }
//     else {
//         next();
//     }
// };
//
// app.use(allowCrossDomain);

mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.listen(port);
console.log('Magic happens at port:' + port);

function handleError(res, reason, message, code) {
    console.log('ERROR: ' + reason);
    res.status(code || 500).json({ 'error': message });
}

const apiRoutes = express.Router();

apiRoutes.post('/authenticate', function (req, res) {
    User.findOne({
        name: req.body.name
    }, function (err, user) {
        if (err) {
            handleError(res, err.message, 'Failed to get user.');
        }

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Incorrect password.' });
            } else {
                const token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: ONE_DAY_IN_SECONDS,
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                });
            }
        }

    });
});

apiRoutes.get('/', function (req, res) {
    res.send('Hello! The API is running...');
});

apiRoutes.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        if (err) {
            handleError(res, err.message, 'Failed to get users.');
        }
        res.json(users);
    })
});

app.use('/api', apiRoutes);


// app.get('/contacts', function(req, res) {
//     db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
//         if (err) {
//             handleError(res, err.message, 'Failed to get contacts.');
//         } else {
//             res.status(200).json(docs);
//         }
//     });
// });
//
// app.post('/contacts', function(req, res) {
//     const newContact = req.body;
//     newContact.createDate = new Date();
//
//     if (!(req.body.firstName || req.body.lastName)) {
//         handleError(res, 'Invalid user input', 'Must provide a first or last name.', 400);
//     }
//
//     db.collection(CONTACTS_COLLECTION).insertOne(newContact, function (err, doc) {
//         if (err) {
//             handleError(res, err.message, 'Failed to create new contact.');
//         } else {
//             res.status(201).json(doc.ops[0]);
//         }
//     });
// });

// '/contacts/:id'
//     GET: find contact by id
//     PUT: update contact by id
//     DELETE: deletes contact by id

app.get('/contacts/:id', function (req, res) {

});

app.put('/contacts/:id', function (req, res) {

});

app.delete('/contacts/:id', function (req, res) {

});

