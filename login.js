const { accessToken, clientId, clientSecret, redirectUri } = require('./config.json');
const prompt = require("prompt-sync")({ sigint: true });
const fs = require('fs');

var SpotifyWebApi = require('spotify-web-api-node');

var configs = {
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirectUri
}

var spotifyApi = new SpotifyWebApi(configs);

var scopes = ['user-read-private', 'user-read-email'];
var state = 'some-state-of-my-choice';
// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

console.log(authorizeURL);

// Retrieve an access token and a refresh token
const code = prompt("Enter access code: ");
spotifyApi.authorizationCodeGrant(code).then(
  function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    const configFileName = './config.json'
    const configFile = require(configFileName);
    configFile.accessToken = data.body['access_token'];
    configFile.refreshToken = data.body['refresh_token'];

    fs.writeFile(configFileName, JSON.stringify(configFile, null, 2), function writeJSON(err) {
      if (err) return console.log(err);
      console.log(JSON.stringify(configFile));
      console.log('writing to ' + configFileName);
    });

  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);

