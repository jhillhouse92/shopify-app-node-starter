import seraph from 'seraph';
import UUID from 'node-uuid';

export const GLOBALS = {
    baseURL: 'ENTER_DOMAIN',
    apiKey: 'API_KEY',
    secret: 'API_SECRET',
    scope: 'APP_SCOPE'
};

//this is not a constant
export let CONFIG = {
    shopify_api_key: GLOBALS.apiKey, // Your API key
    shopify_shared_secret: GLOBALS.secret, // Your Shared Secret
    shopify_scope: GLOBALS.scope,
    redirect_uri: GLOBALS.baseURL + '/oauth',
    nonce: UUID.v1() // you must provide a randomly selected value unique for each authorization request
};

export const DB = seraph({ server: 'NE04J_SERVER',
                    user: 'NE04J_USER',
                    pass: 'NE04J_PASSWORD' });
