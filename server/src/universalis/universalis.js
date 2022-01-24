const { RESTDataSource } = require('apollo-datasource-rest');

class UniversalisAPI extends RESTDataSource {
  constructor() {
    // Always call super()
    super();
    // Sets the base URL for the REST API
    this.baseURL = 'https://universalis.app/api';
  }

  async getItemListings(world, ids) {
    // Send a GET request to the specified endpoint
    return this.get(`${encodeURIComponent(world)}/${encodeURIComponent(ids.join(','))}`);
  }
}

module.exports = UniversalisAPI;