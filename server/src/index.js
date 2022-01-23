// setup env variables
require('dotenv').config({
    path: '../.env'
})

const { ApolloServer } = require('apollo-server');
const resolvers = require('./resolvers/resolver')
const typeDefs = require('./schema/schema')
const jwt = require('jsonwebtoken')

// SEQUELIZE SERVER
const db = require('./database/models');

const getUser = token => {
    try {
        if (token) {
            return jwt.verify(token, process.env.JWT_SECRET)
        }
        return null
    } catch (error) {
        return null
    }
};

process.on('db-auth-finished', () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const token = req.get('Authorization') || ''
            return {
                db: db,
                user: getUser(token.replace('Bearer', ''))
            }
        }
    });

    server.listen()
        .then(({ url }) =>
            console.log(`Server is running on ${url}`)
        );
});

(async () => {
    try {
        await db.sequelize.sync()
        console.log('Connection has been established successfully.');
        process.emit('db-auth-finished')
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();