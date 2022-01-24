const models = require('../database/models')
const jsonwebtoken = require('jsonwebtoken');

// TODO: move this to another container
const AuthResolver = {
    Query: {
        getUsers: async (parent, { filter, pagination }, { db, user }) => {
            try {
                if (!user)
                    throw new Error('You are not authenticated');
                let query_options = {
                    limit: 10,      // default
                    offset: 0       // default
                };
                if (filter) {
                    const { id, username } = filter;
                    let where = {}
                    if (id)
                        where.id = id;
                    if (username)
                        where.username = username;
                    query_options.where = where;
                }
                if (pagination) {
                    query_options.limit = pagination.items;
                    query_options.offset = pagination.items * (pagination.page - 1);
                }
                return db.User.findAll(query_options);
            } catch (error) {
                throw new Error(error.message)
            }
        }
    },
    Mutation: {
        createUser: async (parent, { username, password }, { db }) => {
            try {
                console.log("HELLO")
                if (await db.User.findOne({
                    where: {
                        username: username
                    }
                })) {
                    throw new Error('User already exists');
                }
                const user = await db.User.create({
                    username: username,
                    password: password
                });
                const token = jsonwebtoken.sign({
                    username: username
                }, process.env.JWT_SECRET);

                return {
                    token,
                    user: {
                        username: user.username
                    }
                }

            } catch (error) {
                throw new Error(error)
            }
        },
        login: async (parent, { username, password }, { db }) => {
            try {
                const user = await models.User.findOne({ where: { username } })
                if (!user) {
                    throw new Error('No matching user');
                }
                const validPass = await db.User.checkPassword(password, user.password);
                if (!validPass) {
                    throw new Error('Incorrect Password');
                }

                const token = jsonwebtoken.sign({
                    username: username
                }, process.env.JWT_SECRET);

                return {
                    token,
                    user: user
                }

            } catch (error) {
                throw new Error(error)
            }
        },
        updateUser: async (parent, { id, username, password }, { db, user }) => {
            try {
                if (!user)
                    throw new Error('You are not authenticated');

                const user_to_update = await db.User.findOne({
                    id: id
                });
                if (!user_to_update)
                    throw new Error('No user found of that ID');

                if (username) {
                    if (await db.User.findOne({
                        where: {
                            username: username
                        }
                    })) {
                        throw new Error('User already exists');
                    } else {
                        user_to_update.username = username;
                    }
                }

                if (password) {
                    user_to_update.password = password;
                }

                return await user_to_update.save();
            } catch (error) {
                throw new Error(error.message)
            }
        },
        deleteUser: async (parent, { id }, { db, user }) => {
            try {
                if (!user)
                    throw new Error('You are not authenticated');
                const user_to_delete = await db.User.findOne({
                    id: id
                });
                await user_to_delete.destroy();
                return true;
            } catch (error) {
                throw new Error(error.message)
            }
        }
    }
}

module.exports = AuthResolver;