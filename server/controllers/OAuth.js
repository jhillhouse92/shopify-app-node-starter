import ShopifyAPI from 'shopify-node-api';
import { GLOBALS, CONFIG, DB } from '../config/globals';

class OAuth {
    constructor() {
        
    }
    
    landing(req, res) {        
        CONFIG.shop = req.query.shop; // MYSHOP.myshopify.com
        
        //check to see if we have this account
        let predicate = {
            shop: CONFIG.shop,
            active: true
        };
        
        DB.find(predicate, false, 'Account', function(err, result) {
            if (!err) {
                if (result.length > 0) {
                    //we have a shop, we are logging in from Shopify
                    res.render('index.ejs', {shop: CONFIG.shop, apiKey: CONFIG.shopify_api_key});
                } else {
                    //we must be installing
                    var Shopify = new ShopifyAPI(CONFIG);
                    res.redirect(Shopify.buildAuthURL());
                }
            } else {
                throw err;
            }
        });
    }
    
    redirectUri(req, res) {
        let queryParams = req.query;
        CONFIG.shop = queryParams.shop; // MYSHOP.myshopify.com
        
        let Shopify = new ShopifyAPI(CONFIG); // You need to pass in your config here
        

        Shopify.exchange_temporary_token(queryParams, function(err, data){
            // This will return successful if the request was authentic from Shopify
            // Otherwise err will be non-null.
            // The module will automatically update your config with the new access token
            // It is also available here as data['access_token']
            
            if (!err) {
                //store client, access_token, default subscription level
                //this is a custom property id, not the Neo4J intenral ID, it will be camel case unique system plan identifiers
                let query = 'MATCH (p:SystemPlan {id:\'free\'})' + //find the system plan node with id of free
                            'MERGE (a:Account {shop: {shop}})-[r:HAS_A]->(p)' + //find the account node with a relationship to the prior node, if doesn't exist create
                            'ON CREATE SET r.createdOn = timestamp(), a.active = true, a.token = {accessToken}' + //on create, set the created time on the relationship, set active and token on the account
                            'ON MATCH SET a.active = true, a.token = {accessToken}, a.uninstalledOn = NULL ' + //on find, set the active to true (active would be false if account exists already), update the token, and remove uninstalledOn property
                            'RETURN a';
                
                DB.query(query, { shop: queryParams.shop, accessToken: data.access_token }, function(dbErr, result) {
                    
                    if (!dbErr && result.length > 0) {
                        //register the uninstall webhook
                        let webhook = {
                            webhook: {
                                topic: 'app/uninstalled',
                                address: GLOBALS.baseURL + '/uninstall',
                                format: 'json'
                            }
                        };
                        
                        //register the uninstall webhook
                        Shopify.post('/admin/webhooks.json', webhook, function(shopifyErr, shopifyResult){
                            if (!err && typeof shopifyResult.webhook !== 'undefined') {
                                //return to the store and launch the app
                                res.redirect('https://' + queryParams.shop + '/admin/apps/' + GLOBALS.apiKey);
                            } else {
                                console.log('Shopify API Error Creating Webhook in OAuth:', shopifyErr);
                                return res.status(500).send('There was an error installing the app!');
                            }
                        });
                        
                        
                    } else {
                        console.log('DB Error in OAuth reirectUri:', dbErr);
                        return res.status(500).send('There was an error installing the app!');
                    }
                });
                
            } else {
                console.log('Shopify Error in OAuth redirectUri:', err);
                return res.status(500).send('There was an error installing the app!');
            }
        });
    }
    
    uninstall(req, res) {
        
        let query = 'MATCH (a:Account {shop: {shop}}) SET a.active = false, a.uninstalledOn = timestamp() RETURN a';
        
        DB.query(query, { shop: req.body.myshopify_domain }, function(err, result) {
            if (!err && result.length > 0) {
                console.log(`App was successfull installed by ${req.body.myshopify_domain}`);
                return res.send(200); //give 200 OK response
            } else {
                console.log(`There was an error uninstalleding ${req.body.myshopify_domain}:`, err);
                return res.send(500);
            }
        });
    }
}

export default OAuth;
