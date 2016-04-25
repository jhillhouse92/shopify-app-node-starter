import express from 'express';
import bodyParser from 'body-parser';
import Routes from './config/routes';

let app = express();

app.set('port', (process.env.PORT || 3001));
app.set('views', __dirname + '/views');

app.use(bodyParser.json());

let router = new Routes(app);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
