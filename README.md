# Shopify App Node Starter project in ES6
This is a starter project for creating Shopify Apps with a Neo4J database and ES6 Node.JS

## Install
`$ npm install`

This will install all of the packages specified in package.json. There are webpack and react / redux packages included to expand upon this and add a client side. Babel is included as a dependency instead of devDependency because Heroku (the deployed instanced I developed too) only installs the dependencies and babel is a requirement to build since it is in ES6.

## Usage

1. Sign-up for a partner account with Shopify. See the [Shopify API Getting Started Guide](https://docs.shopify.com/api/guides) for more information.
2. Create a Shopify App with *Embedded App SDK enabled, application url of the APP_DOMAIN, and the Redirection URL of APP_DOMAIN/oauth*. For example, https://myapp.herokuapp.com/ for the APP_DOMAIN and https://myapp.herokuapp.com/oauth for the Redirection URL. The properties can be changed, but just needed to be updated accordingly in the routes.js file.
3. Get a Node server and Neo4J server (I developed against and tested for Heroku and Graph Story, a Neo4J Heroku add-on).
4. Update the server/config/globals.js file with the specified credentials.
5. Deploy the app to the server.

```
//Shopify App related globals
export const GLOBALS = {
    baseURL: 'ENTER_DOMAIN',
    apiKey: 'API_KEY',
    secret: 'API_SECRET',
    scope: 'APP_SCOPE'
};

//Seraph and Neo4J related global
export const DB = seraph({ server: 'NE04J_SERVER',
                    user: 'NE04J_USER',
                    pass: 'NE04J_PASSWORD' });

```
### References
- For the Node Shopify API, I used [shopify-node-api](https://github.com/christophergregory/shopify-node-api).
- For connecting to Neo4J, I used [seraph](https://github.com/brikteknologier/seraph).
- For information regarding the Shopify API, see [Shopify's API Documentation](https://docs.shopify.com/api/reference).
