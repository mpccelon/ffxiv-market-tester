const ItemResolver = {
    Query: {
        getItems: async (parent, { filter, pagination }, { db, user }) => {
            try {
                if (!user)
                    throw new Error('You are not authenticated');
                let query_options = {
                    limit: 10,      // default
                    offset: 0       // default
                };
                if (filter) {
                    query_options.where = {
                        'name': filter.name
                    };
                }
                if (pagination) {
                    query_options.limit = pagination.items;
                    query_options.offset = pagination.items * (pagination.page - 1);
                }
                return db.Item.findAll(query_options);
            } catch (error) {
                throw new Error(error.message)
            }
        }
    },
    Mutation: {
    }
}

module.exports = ItemResolver;