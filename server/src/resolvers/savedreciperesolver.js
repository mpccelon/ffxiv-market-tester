const SavedRecipeResolver = {
    Query: {
        getSavedRecipes: async (parent, { pagination, fetchMarketPrices }, { db, user, dataSources }) => {
            try {
                if (!user)
                    throw new Error('You are not authenticated');
                const user_to_get_recipe = await db.User.findByPk(user.id);
                if(!user_to_get_recipe)
                    throw new Error('Invalid user');
                const includes = {
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
                let query_options = {
                    limit: 10,      // default
                    offset: 0,      // default
                    ...includes
                };
                if (pagination) {
                    query_options.limit = pagination.items;
                    query_options.offset = pagination.items * (pagination.page - 1);
                }

                let recipes = await user_to_get_recipe.getRecipes(query_options);
                
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
                    return user_to_get_recipe.getRecipes(query_options);
                }

                return recipes;
            } catch (error) {
                throw new Error(error.message)
            }
        }
    },
    Mutation: {
        saveRecipe: async (parent, { recipe_id }, { db, user }) => {
            try {
                if (!user)
                    throw new Error('You are not authenticated');
                    console.log(user);
                const user_to_add_recipe = await db.User.findByPk(user.id);
                const recipe = await db.Recipe.findByPk(recipe_id);

                if (!user_to_add_recipe)
                    throw new Error('Invalid User');

                if (!recipe)
                    throw new Error('Invalid Recipe');
                if (await user_to_add_recipe.hasRecipe(recipe))
                    throw new Error('Already has this Recipe');

                await user_to_add_recipe.addRecipe(recipe);
                await user_to_add_recipe.save();
                return user_to_add_recipe.reload({
                    include: {
                        model: db.Recipe,
                        as: 'recipes',
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
                    }
                });
            } catch (error) {
                throw new Error(error.message)
            }
        },
        removeSavedRecipe: async (parent, { recipe_id }, { db, user }) => {
            try {
                if (!user)
                    throw new Error('You are not authenticated');
                console.log(user);
                const user_to_add_recipe = await db.User.findByPk(user.id);
                const recipe = await db.Recipe.findByPk(recipe_id);

                if (!user_to_add_recipe)
                    throw new Error('Invalid User');

                if (!recipe)
                    throw new Error('Invalid Recipe');
                    
                if (!await user_to_add_recipe.hasRecipe(recipe))
                    throw new Error('Already does not have this Recipe');

                await user_to_add_recipe.removeRecipe(recipe);
                await user_to_add_recipe.save();
                return user_to_add_recipe.reload({
                    include: {
                        model: db.Recipe,
                        as: 'recipes',
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
                    }
                });
            } catch (error) {
                throw new Error(error.message)
            }
        },
    }
}

module.exports = SavedRecipeResolver;