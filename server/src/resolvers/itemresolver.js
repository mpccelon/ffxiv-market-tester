const ItemResolver = {
    Query: {
        getItems: async (parent, args, {db, user}) => {
            try {
                if(!user)
                    throw new Error('You are not authenticated')
                
                return db.Item.findAll({ limit: 10 });
            } catch (error) {
                throw new Error(error.message)
            }
        }
    },
    Mutation: {
    }
}

module.exports = ItemResolver;