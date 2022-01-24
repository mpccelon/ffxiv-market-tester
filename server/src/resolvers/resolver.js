const jsonwebtoken = require('jsonwebtoken')
const ItemResolver = require('./itemresolver.js')
const AuthResolver = require('./authresolver.js')
require('dotenv').config()

const resolvers = {
    Query: {
        ...ItemResolver.Query,
        ...AuthResolver.Query
    },
    Mutation: {
        ...ItemResolver.Mutation,
        ...AuthResolver.Mutation
    }
}

module.exports = resolvers;