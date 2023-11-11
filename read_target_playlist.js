const { accessToken, targetPlaylistID } = require('./config.json');

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi();

spotifyApi.setAccessToken(accessToken);

spotifyApi.getPlaylist(targetPlaylistID)
.then(function(data) {
  var total = data.body.tracks.total;
  var offset = 0;
  while (offset < total) {
    spotifyApi.getPlaylistTracks(targetPlaylistID,
      {
        offset: offset,
        limit: 100,
        fields: 'items'
      })
      .then(
        function(data) {
          data.body.items.forEach(track => {
            var trackName = track.track.name;
            var artistName1 = track.track.artists[0].name
            if (track.track.artists.length > 1) {
              var artistName2 = track.track.artists[1].name
            } else {
              var artistName2 = ""
            }

            if (track.track.artists.length > 2) {
              var artistName3 = track.track.artists[2].name
            } else {
              var artistName3 = ""
            }
            spotify_url = track.track.external_urls["spotify"]
            console.log(`${trackName}, ${artistName1}, ${artistName2}, ${artistName3}, ${spotify_url}`)
          });
      },
      function(err) {
        console.log('Something went wrong!', err);
      }
    );
    offset += 100;
  }
}, function(err) {
  console.log('Something went wrong!', err);
});
