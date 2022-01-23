const jsonwebtoken = require('jsonwebtoken')
const ItemResolver = require('./itemresolver.js')

const resolvers = {
    Query: {
        ...ItemResolver.Query
    },
    Mutation: {
        ...ItemResolver.Mutation
    }
}

module.exports = resolvers;