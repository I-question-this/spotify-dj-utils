const { accessToken, refreshToken } = require('./config.json');

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi();

spotifyApi.setAccessToken(accessToken);

// Get Elvis' albums
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
  function(data) {
    console.log('Artist albums', data.body);
  },
  function(err) {
    console.error(err);
  }
);
