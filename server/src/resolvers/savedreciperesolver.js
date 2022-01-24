const SavedRecipeResolver = {
    Query: {
        getSavedRecipes: async (parent, { pagination, fetchMarketPrices }, { db, user }) => {
            try {
                if (!user)
                    throw new Error('You are not authenticated');
                const user_to_get_recipe = await db.User.findByPk(user.id);
                if(!user_to_get_recipe)
                    throw new Error('Invalid user');

                let query_options = {
                    limit: 10,      // default
                    offset: 0       // default
                };
                if (pagination) {
                    query_options.limit = pagination.items;
                    query_options.offset = pagination.items * (pagination.page - 1);
                }

                return user_to_get_recipe.getRecipes({
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
                });
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