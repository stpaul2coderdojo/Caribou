<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Play MP3 files using SSML</title>
</head>
<body>
  <button onclick="play('grunt')">Play Grunt</button>
  <button onclick="play('snarl')">Play Snarl</button>
  <button onclick="play('bellow')">Play Bellow</button>
  <button onclick="play('mews')">Play Mews</button>
  <button onclick="play('clicks')">Play Clicks</button>
  <button onclick="play('barks')">Play Barks</button>

  <script>
    function play(fileType) {
      const audio = new Audio();
      audio.src = 'data:audio/ssml;charset=utf-8,' + encodeURIComponent(generateSSML(fileType));
      audio.play();
    }
  </script>
</body>
</html>
