const Card = require('../models/card.js');

module.exports.addCard = function (req, res, next) {
    const label = req.body.label;
    const parentId = req.body.parentId;

    if (!label) {
        return res.status(422).send({ error: 'You must enter a label.'});
    }

    const card = new Card({
        label,
        parentId
    });

    card.save(function (err, card) {
        if (err) {
            return next(err);
        }

        res.status(201).json({
            message: 'card created'
        });
    });
};

module.exports.getCards = function (req, res, next) {
    Card.find({}, function(err, cards) {
        if (err) {
            return next(err);
        }

        res
            .status(201)
            .json({
                cards
            });
    });
};