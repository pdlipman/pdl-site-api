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
        },
        seq: {
            type: Number,
            unique: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
);

module.exports = mongoose.model('Card', CardSchema);