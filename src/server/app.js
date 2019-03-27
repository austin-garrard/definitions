const express = require('express');
const path = require('path');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

var redirectToHTTPSOrCustomDomain = require('./redirect.js').redirectToHTTPSOrCustomDomain

const app = express();
const mountRoutes = require('./routes')
mountRoutes(app);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//use validator?

// enforce.HTTPS({ trustProtoHeader: true });
app.use(redirectToHTTPSOrCustomDomain([/localhost:(\d{4})/], [/\/insecure/]));


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/static')));


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/static/index.html'));
});

module.exports = app;

//module.exports = app.listen(5000);
