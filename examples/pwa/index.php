<?php
  $expire=$_GET['expire']??0;
  $date = gmdate('D, d M Y H:i:s',$expire+time()).' GMT';
  header('Access-Control-Allow-Origin: *');
  header("Expires: ".$expire);
  header("Last-Modified: ".$date);
  if(!$expire) {
    header("Cache-Control: no-cache, must-revalidate");
    header("Pragma: no-cache");
  }
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <!-- "Usual" title charset description viewport -->
  <title>Refuges.info</title>
  <meta charset="utf-8">
<link href="https://www.refuges.info/images/icones/favicon.svg" rel="icon" type="image/svg+xml" />
  <meta name="description" content="Test Progressive Web Application">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <link href="manifest.json" rel="manifest">

  <link href="../../dist/myol.css" rel="stylesheet">
  <link href="index.css" rel="stylesheet">
  <script src="../../dist/myol-debug.js"></script>
  <script src="index.js" defer></script>
  <script src="map.js" defer></script>
</head>

<body>
  <div id="map"></div>
  <hr/>
  <img src="favicon.sgv.php?expire=5" />
  <?=gmdate('H:i:s')?>
</body>
</html>

<?php
file_put_contents('toto.log',
	$date.'  '.$_SERVER['QUERY_STRING'].'<br/>'.PHP_EOL,
	FILE_APPEND
);
//echo date('r').PHP_EOL;
//echo file_get_contents('toto.log');
