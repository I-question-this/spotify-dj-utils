const { accessToken, userName } = require('./config.json');

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi();

spotifyApi.setAccessToken(accessToken);

spotifyApi.getUserPlaylists(userName)
.then(function(data) {
  console.log('Retrieved playlists', data.body);
},function(err) {
  console.log('Something went wrong!', err);
});
