const jsonwebtoken = require('jsonwebtoken')
const ItemResolver = require('./itemresolver.js')
const AuthResolver = require('./authresolver.js')
const RecipeResolver = require('./reciperesolver.js')
const SavedRecipeResolver = require('./savedreciperesolver.js')
require('dotenv').config()

const resolvers = {
    Query: {
        ...AuthResolver.Query,
        ...ItemResolver.Query,
        ...RecipeResolver.Query,
        ...SavedRecipeResolver.Query,
    },
    Mutation: {
        ...AuthResolver.Mutation,
        ...ItemResolver.Mutation,
        ...RecipeResolver.Mutation,
        ...SavedRecipeResolver.Mutation,
    }
}

module.exports = resolvers;