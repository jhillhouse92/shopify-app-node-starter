import OAuth from '../controllers/OAuth';

class Routes {
    
    constructor(app) {
        let OAuthController = new OAuth();
        
        app.get('/', OAuthController.landing);
        app.get('/oauth', OAuthController.redirectUri);
        app.post('/uninstall', OAuthController.uninstall);
    }
    
}

export default Routes;
