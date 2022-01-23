const jsonwebtoken = require('jsonwebtoken')
const ItemResolver = require('./itemresolver.js')

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        // 2
        feed: () => links,
        link: (parent, args) => {
            let index = parseInt(args.id.slice(5));
            return links[index];
        },
        ...ItemResolver.Query
    },
    Mutation: {
        // 2
        post: (parent, args) => {
            let idCount = links.length
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            }
            links.push(link)
            return link
        },
        // # Update a link
        updateLink: (parent, args) => {
            let idCount = links.length
            links[idCount].description = args.description;
            links[idCount].url = args.url;
            return links;
        },
        // # Delete a link
        deleteLink: (parent, args) => {
            let idCount = links.length
            links[idCount].description = args.description;
            links[idCount].url = args.url;
            return links;
        }
    }
}

module.exports = resolvers;