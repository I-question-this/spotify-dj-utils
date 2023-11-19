const { accessToken, targetPlaylistID } = require('./config.json');

var SpotifyWebApi = require('spotify-web-api-node');
var Excel = require('exceljs');

var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(accessToken);

var trackColumn = 1
var artistName1Column = 2
var artistName2Column = 3
var artistName3Column = 4
var spotifyURLColumn = 5
var durationColumn = 7

var addSongsToExcelSheet = function(data, file_path) {
  var workbook = new Excel.Workbook();
  workbook.xlsx.readFile(file_path)
    .then(function() {
      var worksheet = workbook.getWorksheet(1);
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

        var duration_ms = track.track.duration_ms
        var duration_min = Math.floor(duration_ms / 1000 / 60);
        var duration_sec = Math.floor(duration_ms / 1000 % 60);
        var duration = parseFloat(`${duration_min}.${duration_sec}`);

        var foundSongInSheet = false;
        worksheet.eachRow(function(row, rowNumber) {
          if (row.getCell(trackColumn) == trackName
              && row.getCell(artistName1Column) == artistName1
              && row.getCell(artistName2Column) == artistName2
              && row.getCell(artistName3Column) == artistName3
              && row.getCell(durationColumn) == duration) {
            foundSongInSheet = true;
          }
        });
        if (!foundSongInSheet) {
          var spotify_url = track.track.external_urls["spotify"]

          worksheet.addRow([trackName, artistName1, artistName2, artistName3, spotify_url, false, duration])
          console.log(`Added: "${trackName}", "${artistName1}", "${artistName2}", "${artistName3}", "${spotify_url}", ${duration}`)
        }
      })
      return workbook.xlsx.writeFile(`edited_${file_path}`)
    })
}

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
          addSongsToExcelSheet(data, "swing_songs.xlsx");
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