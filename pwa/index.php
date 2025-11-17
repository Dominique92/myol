<!DOCTYPE html><?=gmdate('H:i:s')?>
<html lang="fr">
<head>
  <!-- "Usual" title charset description viewport -->
  <title>Refuges.info</title>
  <meta charset="utf-8">
  <meta name="description" content="Test Progressive Web Application">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <link href="manifest.json" rel="manifest">
  <script src="trace.js"></script>
  <script>
    <?php include('index.js')?>
  </script>
  <style>
    <?php include('index.css')?>
  </style>
</head>

<body>
AAAA
<img src="favicon.sgv.php?expire=5" />
ZZZZ
</body>
</html>
<?php
$expire=$_GET['expire']??0;
$date = gmdate('D, d M Y H:i:s',$expire+time()).' GMT';
header("Expires: ".$expire);
header("Last-Modified: ".$date);
if(!isset($expire)) {
  header("Cache-Control: no-cache, must-revalidate");
  header("Pragma: no-cache");
}
header('Access-Control-Allow-Origin: *');

file_put_contents('toto.log',
	$date.'  '.$_SERVER['QUERY_STRING'].'<br/>'.PHP_EOL,
	FILE_APPEND
);
echo date('r').PHP_EOL;
echo file_get_contents('toto.log');
