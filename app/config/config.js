module.exports = {
    secret: process.env.JWT_SECRET,
    port: process.env.PORT || 8090,
    database: process.env.MONGODB_URI,
};