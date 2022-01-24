const RecipeResolver = {
    Query: {
        getRecipeFromId: async (parent, { recipe_id, fetchMarketPrices }, { db, user }) => {
            try {
                if (!user)
                    throw new Error('You are not authenticated');
                const recipe = await db.Recipe.findByPk(recipe_id, {
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
                });
                if (!recipe)
                    throw new Error('No recipe found with that ID')
                return recipe;
            } catch (error) {
                throw new Error(error.message)
            }
        },      
        getRecipesFromItem: async (parent, { item_id, fetchMarketPrices }, { db, user }) => {
            try {
                if (!user)
                    throw new Error('You are not authenticated');
                const recipes = await db.Recipe.findAll({
                    where: {
                        result_item_id: item_id
                    },
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
                });
                // console.log(recipes);
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