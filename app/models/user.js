const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema(
    {
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profile: {
            firstName: { type: String },
            lastName: { type: String }
        },
        role: {
            type: [String],
            enum: ['Member', 'Client', 'Owner', 'Admin'],
            default: ['Member']
        },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date }
    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', function(next) {
    const user = this;
    const saltFactor = 5;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(saltFactor, function(err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }

        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
