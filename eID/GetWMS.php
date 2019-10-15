<?php
/*
 *  (c) 2019 Rainer Schleevoigt <rainer.schleevoigt@sub.uni-hamburg.de>
 *      Hamburg State and University Library
 *
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 * ************************************************************* */
use TYPO3\CMS\Core\Utility\GeneralUtility;

const TTL = 24*3600*100;
$CACHEFOLDER = 'typo3temp/wmszwischenspeicher';
$endpoint = "https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_GB";//GeneralUtility::_GP('endpoint');

$layers =  GeneralUtility::_GP('layers');
$srs =  GeneralUtility::_GP('srs');
$size =  GeneralUtility::_GP('retina')*256;
$bbox =  GeneralUtility::_GP('bbox');

$querystring= 'service=WMS&request=GetMap&styles=&version=1.1.3&transparent=true&format=image/png';
$querystring .= '&bbox='.$bbox.'&crs='.$srs.'&layers='.$layers .'&width='.$size .'&height='.$size;


$url= $endpoint . '?' . $querystring;
$cache = $CACHEFOLDER .'/' . md5($url) . '.png';
if (!file_exists($CACHEFOLDER)) {
    mkdir($CACHEFOLDER, 0777, true);
}
// not exists or older then a week
if (!file_exists($cache) || filemtime($cache)+TTL<  time()) {
    file_put_contents($cache,file_get_contents($url));
    error_log($url);
}
//header("Content-type: text/plain");

header('Content-type: image/png');
echo file_get_contents($cache);
error_log("URL=");
error_log($url);
exit;