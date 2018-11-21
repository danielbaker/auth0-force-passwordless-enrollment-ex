const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const jwtExpress = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const AuthenticationClient = require("auth0").AuthenticationClient;
require('dotenv').config();

const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0ClientID = process.env.AUTH0_CLIENT_ID;
const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;

const checkAuth0Jwt = jwtExpress({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
  }),
  issuer: `https://${auth0Domain}/`,
  algorithms: ['RS256']
});

const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get('/api/start-enrollment', (req, res) => {
  const api = new AuthenticationClient({
    domain: auth0Domain,
    clientId: auth0ClientID,
    clientSecret: auth0ClientSecret,
  });

  var accessToken = req.headers.authorization.split(' ')[1];

  api.getProfile(accessToken, (err, user) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    console.log(user);

    if (!user.email_verified) {
      api.passwordless.sendEmail({
        email: user.email,
        send: "code"
      }, (err) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        res.send({status: "email_enrollment", email: user.email});
      });
    } else if (!user["https://demo.com/mobile_verified"]) {
      const mobile = `+61${user["https://demo.com/mobile"].slice(1)}`;
      api.passwordless.sendSMS({
        phone_number: mobile
      }, (err) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        res.send({status: "mobile_enrollment", mobile: mobile});
      });
    } else {
      res.send({status: "enrollment_complete"});
    }

  });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);
