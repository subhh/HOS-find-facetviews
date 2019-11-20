<?php
const TTL = 24*3600*7;
$CACHEFOLDER = 'typo3temp/kachelzwischenspeicher';
$url = TYPO3\CMS\Core\Utility\GeneralUtility::_GP('url');
$cache = $CACHEFOLDER .'/' . md5($url) . '.png';
if (!file_exists($CACHEFOLDER)) {
    mkdir($CACHEFOLDER, 0777, true);
}
// not exists or older then a week
if (!file_exists($cache) || filemtime($cache)+TTL<  time()) {
    file_put_contents($cache,file_get_contents($url));
}
header('Content-type: image/png');
echo file_get_contents($cache);
exit;