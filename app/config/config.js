module.exports = {
    secret: process.env.JWT_SECRET,
    port: process.env.PORT || 8080,
    database: process.env.MONGODB_URI,
};