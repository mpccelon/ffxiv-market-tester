const models = require('../database/models')
const jsonwebtoken = require('jsonwebtoken');

const UserResolver = {
    Query: {
        getUsers: async (parent, {filter, pagination}, {db}) => {
            const query = {
                offset: 0,
                limit: 10,
                raw: true,
                attributes: ['username']
            }
        }
    },
    Mutation: {
        createUser: async (parent, {username, password}, {db}) => {
            try {
                if(await db.User.findOne({
                    where: {
                        [db.Sequelize.Op.or]: [
                            { username : username }
                        ]
                    }
                })) {
                    throw new Error('User already exists');
                }
                const user = await db.User.create({
                    username: username,
                    password: password
                });
                const token = jsonwebtoken.sign( {
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
        login: async (parent, {username, password}, {db}) => {
            try {
                const user = await models.User.findOne({ where: { username }})
                if(!user) {
                    throw new Error('No matching user');
                }
                const validPass = await db.User.checkPassword(password, user.password);
                if(!validPass) {
                    throw new Error('Incorrect Password');
                }
                
                const token = jsonwebtoken.sign( {
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
    }
}

module.exports = UserResolver;