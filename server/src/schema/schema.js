const fs = require('fs');
const path = require('path');

// Read schema
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')
module.exports = typeDefs;