const models = require('../database/models')

const ItemResolver = {
    Query: {
        items: (parent, args, context) => {
            return context.db.Item.findAll({ limit: 10 });
        }
    },
    Mutation: {
    }
}

module.exports = ItemResolver;