const ingredient = require("../database/models/ingredient");

const RecipeResolver = {
    Query: {
        getRecipeFromId: async (parent, { recipe_id, fetchMarketPrices }, { db, user, dataSources }) => {
            try {
                if (!user)
                    throw new Error('You are not authenticated');
                const query_options = {
                    // TODO: lazy load this when not included in query
                    include: [{
                        model: db.Item,
                        as: 'result_item'
                    }, {
                        model: db.Ingredient,
                        as: 'ingredients',
                        include: [{
                            model: db.Item,
                            as: 'item'
                        }]
                    }]
                };
                const recipe = await db.Recipe.findByPk(recipe_id, query_options);
                if (!recipe)
                    throw new Error('No recipe found with that ID')
                
                // fetch prices from universalis and update all items
                let fetchedItems = new Set();
                if (fetchMarketPrices) {
                    // populate itemIds from result_item + ingredient
                    fetchedItems.add(recipe.result_item);
                    recipe.ingredients.forEach(ingredient => {
                        fetchedItems.add(ingredient.item);
                    })
                    let itemIds = Array.from(fetchedItems).map(({id}) => id);
                    // console.log(fetchedItems);
                    let fetchedPrices = {}
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
                    await Promise.all(Array.from(fetchedItems).map((item) => {
                        item.market_price = fetchedPrices[item.id];
                        return item.save();
                    }));

                    // TODO: check if we can find a way to fetch from the API without having to reload
                    return recipe.reload(query_options);         
                }

                return recipe;
            } catch (error) {
                throw new Error(error.message)
            }
        },
        getRecipesFromItem: async (parent, { item_id, fetchMarketPrices }, { db, user, dataSources }) => {
            try {
                if (!user)
                    throw new Error('You are not authenticated');
                const query_options = {
                    // TODO: lazy load this when not included in query
                    include: [{
                        model: db.Item,
                        as: 'result_item'
                    }, {
                        model: db.Ingredient,
                        as: 'ingredients',
                        include: [{
                            model: db.Item,
                            as: 'item'
                        }]
                    }]
                };
                const recipes = await db.Recipe.findAll({
                    where: {
                        result_item_id: item_id
                    },
                    // TODO: lazy load this when not included in query
                    ...query_options
                });

                // fetch prices from universalis and update all items
                let fetchedItems = new Set();
                if (fetchMarketPrices) {
                    // populate itemIds from result_item + ingredient
                    recipes.forEach(recipe => {
                        fetchedItems.add(recipe.result_item);
                        recipe.ingredients.forEach(ingredient => {
                            fetchedItems.add(ingredient.item);
                        });
                    });
                    let itemIds = Array.from(fetchedItems).map(({id}) => id);
                    // console.log(fetchedItems);
                    let fetchedPrices = {}
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
                    await Promise.all(Array.from(fetchedItems).map((item) => {
                        item.market_price = fetchedPrices[item.id];
                        return item.save();
                    }));

                    // TODO: check if we can find a way to fetch from the API without having to reload
                    return db.Recipe.findAll({
                        where: {
                            result_item_id: item_id
                        },
                        // TODO: lazy load this when not included in query
                        ...query_options
                    });
                }
                return recipes;
            } catch (error) {
                throw new Error(error.message)
            }
        },
    },
    Mutation: {
    }
}

module.exports = RecipeResolver;