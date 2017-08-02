/**
 * Created by philiplipman on 7/29/17.
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

const CONTACTS_COLLECTION = 'contacts';

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// reuse connection pool
let db;

// connect to database before starting server
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // save database object from callback for reuse
    db = database;

    const server = app.listen(process.env.PORT || 8080, function () {
        const port = server.address().port;
        console.log('App now running on port: ', port);
    });
});

function handleError(res, reason, message, code) {
    console.log('ERROR: ' + reason);
    res.status(code || 500).json({ 'error': message });
}

// '/contacts'
//     GET: finds all contacts
//     POST: creates a new contact

app.get('/contacts', function(req, res) {
    db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, 'Failed to get contacts.');
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post('/contacts', function(req, res) {
    const newContact = req.body;
    newContact.createDate = new Date();

    if (!(req.body.firstName || req.body.lastName)) {
        handleError(res, 'Invalid user input', 'Must provide a first or last name.', 400);
    }

    db.collection(CONTACTS_COLLECTION).insertOne(newContact, function (err, doc) {
        if (err) {
            handleError(res, err.message, 'Failed to create new contact.');
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

// '/contacts/:id'
//     GET: find contact by id
//     PUT: update contact by id
//     DELETE: deletes contact by id

app.get('/contacts/:id', function(req, res) {

});

app.put('/contacts/:id', function(req, res) {

});

app.delete('/contacts/:id', function(req, res) {

});
