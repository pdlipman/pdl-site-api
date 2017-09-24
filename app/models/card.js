const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema(
    {
        label: {
            type: String,
            lowercase: true,
            required: true
        },
        parentId: {
            type: Schema.ObjectId
        }
    }
);

module.exports = mongoose.model('Card', CardSchema);