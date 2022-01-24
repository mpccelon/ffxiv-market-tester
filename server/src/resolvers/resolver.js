const jsonwebtoken = require('jsonwebtoken')
const ItemResolver = require('./itemresolver.js')
const UserResolver = require('./userresolver.js')
require('dotenv').config()

const resolvers = {
    Query: {
        ...ItemResolver.Query,
        ...UserResolver.Query
    },
    Mutation: {
        ...ItemResolver.Mutation,
        ...UserResolver.Mutation
    }
}

module.exports = resolvers;