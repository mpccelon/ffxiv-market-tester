const ItemResolver = {
    Query: {
        getItems: async (parent, { filter, pagination, fetchMarketPrices }, { db, user, dataSources }) => {
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

                // fetch prices from universalis and update all items
                let fetchedItems = await db.Item.findAll(query_options);
                if (fetchMarketPrices) {
                    let fetchedPrices = {}
                    let itemIds = fetchedItems.map(({ id }) => id);
                    let itemPrices = await dataSources.universalisAPI.getItemListings(process.env.DEFAULT_WORLD, itemIds);
                    if (itemPrices.items) {
                        itemPrices.items.forEach((itemPrice) => {
                            // average price is casted to int, as there are no float prices in-game
                            // TODO:    instead of quantizing, base price off of saved recipe quantity 
                            //          and availability in market listings
                            
                            fetchedPrices[itemPrice.itemID] = parseInt(itemPrice.averagePrice);
                        });
                    } else {
                        fetchedPrices[itemPrices.itemID] = parseInt(itemPrices.averagePrice);
                    }
                    // console.log(fetchedPrices);

                    return fetchedItems.map(x => {
                        x.market_price = fetchedPrices[x.id];
                        return x.save();
                    })
                }
                
                return fetchedItems;
            } catch (error) {
                throw new Error(error.message)
            }
        }
    },
    Mutation: {
    }
}

module.exports = ItemResolver;